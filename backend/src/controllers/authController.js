"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signup = signup;
exports.login = login;
exports.getProfile = getProfile;
exports.logout = logout;
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
        const dbUser = await authRepository_1.authRepository.createUserWithId(userRecord.uid, name, email, password, phone);
        const token = (0, jwt_1.generateToken)({ userId: dbUser.id });
        return {
            token,
            user: {
                id: dbUser.id,
                name: dbUser.name,
                email: dbUser.email,
                phone: dbUser.phone,
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
    const token = (0, jwt_1.generateToken)({ userId: user.id });
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
async function getProfile(ctx) {
    const userId = ctx.request.args.userId;
    const user = await authRepository_1.authRepository.getUserById(userId);
    if (!user) {
        throw new api_server_1.UserNotFound("UserNotFound", { userId });
    }
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
    };
}
async function logout(ctx) {
    return true; // A invalidação de token é feita no cliente
}
//# sourceMappingURL=authController.js.map