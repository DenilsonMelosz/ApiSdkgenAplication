import { api, InvalidCredentials, UserNotFound } from "../generated/api-server";
import { authRepository } from "../repository/authRepository";
import { auth } from "../config/firebase";
import { generateToken, verifyToken } from "../utils/jwt"; 



interface DatabaseUser {
  id: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  createdAt: number;
}

function formatPhoneNumber(phone: string): string {
  if (!phone.startsWith("+")) {
    return `+55${phone.replace(/\D/g, "")}`;
  }
  return phone;
}

export async function signup(
  ctx: any,
  { name, email, password, phone }: { name: string; email: string; password: string; phone: string }
) {
  if (!name || !email || !password || !phone) {
    throw new InvalidCredentials("InvalidCredentials", {
      message: "Nome, e-mail, senha e telefone são obrigatórios",
    });
  }

  try {
    const existingUser = await auth.getUserByEmail(email);
    if (existingUser) {
      throw new InvalidCredentials("InvalidCredentials", {
        message: "E-mail já cadastrado no Firebase",
      });
    }
  } catch (err: any) {
    if (err.code !== "auth/user-not-found") {
      throw new InvalidCredentials("InvalidCredentials", {
        message: "Erro ao verificar e-mail no Firebase",
      });
    }
  }

  try {
    const userRecord = await auth.createUser({
      email,
      password,
      displayName: name,
      phoneNumber: formatPhoneNumber(phone),
    });

    const dbUser = await authRepository.createUserWithId(
      userRecord.uid,
      name,
      email,
      password,
      phone
    );

    const token = generateToken({ userId: dbUser.id });

    return {
      token,
      user: {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        phone: dbUser.phone,
      },
    };
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    throw new InvalidCredentials("InvalidCredentials", {
      message: "Erro ao criar usuário",
    });
  }
}


export async function login(
  ctx: any,
  { email, password }: { email: string; password: string }
) {
  const user = await authRepository.getUserByEmail(email);

  if (!user || user.password !== password) {
    throw new InvalidCredentials("InvalidCredentials", {
      message: "Credenciais inválidas",
    });
  }

  const token = generateToken({ userId: user.id });

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
    },
  };
}


export async function getProfile(ctx: any) {
  const userId = ctx.request.args.extra.userId;

  const user = await authRepository.getUserById(userId);

  if (!user) {
    throw new UserNotFound("UserNotFound", { userId });
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
  };
}


export async function logout(ctx: any) {
  return true; // A invalidação de token é feita no cliente
}
