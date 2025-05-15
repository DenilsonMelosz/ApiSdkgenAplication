"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signup = signup;
exports.login = login;
exports.getProfile = getProfile;
exports.logout = logout;
exports.updateOwnProfile = updateOwnProfile;
exports.listUsers = listUsers;
exports.deleteUser = deleteUser;
exports.generateNewPassword = generateNewPassword;
const api_server_1 = require("../generated/api-server");
const authRepository_1 = require("../repository/authRepository");
const firebase_1 = require("../config/firebase");
const jwt_1 = require("../utils/jwt");
function formatPhoneNumber(phone) {
    if (!phone.startsWith("+")) {
        return `+55${phone.replace(/\D/g, "")}`;
    }
    return phone;
}
// Definindo defaultRole para usar no signup
const defaultRole = "COMUM";
async function signup(ctx, { name, email, password, phone }) {
    if (!name || !email || !password || !phone) {
        throw new api_server_1.InvalidCredentials("InvalidCredentials", {
            message: "Nome, e-mail, senha e telefone são obrigatórios",
        });
    }
    try {
        const existingUser = await firebase_1.auth.getUserByEmail(email);
        if (existingUser) {
            throw new api_server_1.InvalidCredentials("InvalidCredentials", {
                message: "E-mail já cadastrado no Firebase",
            });
        }
    }
    catch (err) {
        if (err.code !== "auth/user-not-found") {
            throw new api_server_1.InvalidCredentials("InvalidCredentials", {
                message: "Erro ao verificar e-mail no Firebase",
            });
        }
    }
    try {
        const userRecord = await firebase_1.auth.createUser({
            email,
            password,
            displayName: name,
            phoneNumber: formatPhoneNumber(phone),
        });
        const dbUser = await authRepository_1.authRepository.createUserWithId(userRecord.uid, name, email, password, phone, defaultRole);
        const token = (0, jwt_1.generateToken)({ userId: dbUser.id, role: dbUser.role });
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
    }
    catch (error) {
        console.error("Erro ao criar usuário:", error);
        throw new api_server_1.InvalidCredentials("InvalidCredentials", {
            message: "Erro ao criar usuário",
        });
    }
}
async function login(ctx, { email, password }) {
    const user = await authRepository_1.authRepository.getUserByEmail(email);
    if (!user || user.password !== password) {
        throw new api_server_1.InvalidCredentials("InvalidCredentials", {
            message: "Credenciais inválidas",
        });
    }
    const token = (0, jwt_1.generateToken)({ userId: user.id, role: user.role });
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
async function getProfile(ctx) {
    const userId = ctx.request.args.extra.userId;
    const user = await authRepository_1.authRepository.getUserById(userId);
    if (!user) {
        throw new api_server_1.UserNotFound("UserNotFound", { userId });
    }
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
    };
}
async function logout(ctx) {
    return true; // A invalidação de token é feita no cliente
}
// Atualizar perfil do usuário
async function updateOwnProfile(ctx, { name, phone, email, password }) {
    const userId = ctx.request.args.extra.userId;
    const user = await authRepository_1.authRepository.getUserById(userId);
    if (!user) {
        throw new api_server_1.UserNotFound("UserNotFound", { userId });
    }
    const updatedUser = {
        ...user,
        name: name || user.name,
        phone: phone || user.phone,
        email: email || user.email,
        password: password || user.password,
    };
    await authRepository_1.authRepository.updateUser(updatedUser);
    return {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        role: updatedUser.role,
    };
}
// Listar usuários (requer ADMIN)
async function listUsers(ctx) {
    if (ctx.request.args.extra.role !== "ADMIN") {
        throw new api_server_1.AccessDenied("AccessDenied", { message: "Apenas administradores podem listar usuários" });
    }
    const users = await authRepository_1.authRepository.listUsers();
    return users.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
    }));
}
// Deletar usuário por ID (requer ADMIN)
async function deleteUser(ctx, { userId }) {
    if (ctx.request.args.extra.role !== "ADMIN") {
        throw new api_server_1.AccessDenied("AccessDenied", { message: "Apenas administradores podem deletar usuários" });
    }
    const success = await authRepository_1.authRepository.deleteUser(userId);
    if (!success) {
        throw new api_server_1.UserNotFound("UserNotFound", { userId });
    }
    return true;
}
// Gerar nova senha para um usuário (requer ADMIN)
async function generateNewPassword(ctx, { userId }) {
    if (ctx.request.args.extra.role !== "ADMIN") {
        throw new api_server_1.AccessDenied("AccessDenied", { message: "Apenas administradores podem gerar nova senha" });
    }
    const newPassword = await authRepository_1.authRepository.generateNewPassword(userId);
    return newPassword;
}
//# sourceMappingURL=authController.js.map