import { api } from "../generated/api-server";
import { authRepository } from "../repository/authRepository";
import { auth } from "../config/firebase";

interface DatabaseUser {
    id: string;
    name: string;
    email: string;
    password: string;
    phone: string;
    createdAt: number;
}
// Método para formatar o número de telefone para o padrão aceitavel no firebase, seguindo o pdrão brasileiro
function formatPhoneNumber(phone: string): string {
    if (!phone.startsWith("+")) {
        return `+55${phone.replace(/\D/g, "")}`;
    }
    return phone;
}

export async function signup(ctx: any, { name, email, password, phone }: any) {
    if (!name || !email || !password || !phone) {
        throw new (api as any).errors.InvalidInput({
            message: "Nome, e-mail, senha e telefone são obrigatórios"
        });
    }

    try {
        const existingUser = await auth.getUserByEmail(email);
        if (existingUser) {
            throw new (api as any).errors.EmailAlreadyExists({
                message: "E-mail já cadastrado no Firebase"
            });
        }
    } catch (err: any) {
        if (err.code !== 'auth/user-not-found') {
            throw new (api as any).errors.UserCreationFailed({
                message: "Erro ao verificar e-mail no Firebase"
            });
        }
    }

    try {
        const userRecord = await auth.createUser({
            email,
            password,
            displayName: name,
            phoneNumber: formatPhoneNumber(phone)
        });

        const dbUser = await authRepository.createUserWithId(
            userRecord.uid,
            name,
            email,
            password,
            phone
        );

        return {
            id: dbUser.id,
            name: dbUser.name,
            email: dbUser.email,
            phone: dbUser.phone
        };
    } catch (error) {
        console.error("Erro ao criar usuário:", error);
        throw new (api as any).errors.UserCreationFailed({
            message: "Erro ao criar usuário no Firebase"
        });
    }
}

export async function login(ctx: any, { email, password }: any) {
    const user = await authRepository.getUserByEmail(email);

    if (!user || user.password !== password) {
        throw new (api as any).errors.InvalidCredentials({
            message: "Credenciais inválidas"
        });
    }

    return {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone
    };
}

export async function getProfile(ctx: any, { userId }: any) {
    const user = await authRepository.getUserById(userId);

    if (!user) {
        throw new (api as any).errors.UserNotFound({
            userId
        });
    }

    return {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone
    };
}

export async function logout(ctx: any) {
    return true;
}
