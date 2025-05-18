import { api, InvalidCredentials, UserNotFound, AccessDenied } from "../generated/api-server";
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
  role: "ADMIN" | "COMUM";
}

function formatPhoneNumber(phone: string): string {
  if (!phone.startsWith("+")) {
    return `+55${phone.replace(/\D/g, "")}`;
  }
  return phone;
}

// Definindo defaultRole para usar no signup , todo usuario cadastrado será "COMUM"
const defaultRole: "ADMIN" | "COMUM" = "COMUM";

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
      phone,
      defaultRole
    );

    const token = generateToken({ userId: dbUser.id, role: dbUser.role });

    return {
      token,
      user: {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        phone: dbUser.phone,
        role: dbUser.role,
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

  const token = generateToken({ userId: user.id, role: user.role });

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
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
    role: user.role,
  };
}

export async function logout(ctx: any) {
  return true; 
}

// Atualizar perfil do usuário

export async function updateOwnProfile(
  ctx: any,
  { name, phone, email, password }: { name: string; phone: string; email: string; password: string }
) {
  const userId = ctx.request.args.extra.userId;

  const user = await authRepository.getUserById(userId);
  if (!user) {
    throw new UserNotFound("UserNotFound", { userId });
  }

  const updatedUser: DatabaseUser = {
    ...user,
    name: name || user.name,
    phone: phone || user.phone,
    email: email || user.email,
    password: password || user.password,
  };

  await authRepository.updateUser(updatedUser);

  return {
    id: updatedUser.id,
    name: updatedUser.name,
    email: updatedUser.email,
    phone: updatedUser.phone,
    role: updatedUser.role,
  };
}

// Listar usuários (requer ADMIN)
export async function listUsers(ctx: any) {
  if (ctx.request.args.extra.role !== "ADMIN") {
    throw new AccessDenied("AccessDenied", { message: "Apenas administradores podem listar usuários" });
  }

  const users = await authRepository.listUsers();

  return users.map((user: DatabaseUser) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
  }));
}

// Deletar usuário por ID ( USUARIO ADMIN)
export async function deleteUser(ctx: any, { userId }: { userId: string }) {
  if (ctx.request.args.extra.role !== "ADMIN") {
    throw new AccessDenied("AccessDenied", { message: "Apenas administradores podem deletar usuários" });
  }

  const success = await authRepository.deleteUser(userId);
  if (!success) {
    throw new UserNotFound("UserNotFound", { userId });
  }

  return true;
}

// Gerar nova senha para um usuário ( USUARIO ADMIN )
export async function generateNewPassword(ctx: any, { userId }: { userId: string }) {
  if (ctx.request.args.extra.role !== "ADMIN") {
    throw new AccessDenied("AccessDenied", { message: "Apenas administradores podem gerar nova senha" });
  }

  const newPassword = await authRepository.generateNewPassword(userId);
  return newPassword;
}