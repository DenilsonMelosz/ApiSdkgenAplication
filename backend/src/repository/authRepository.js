"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRepository = void 0;
const firebase_1 = require("../config/firebase");
exports.authRepository = {
    // Criação de usuário com ID específico
    async createUserWithId(id, name, email, password, phone, role = "COMUM") {
        const user = {
            id,
            name,
            email,
            password,
            phone,
            createdAt: Date.now(),
            role: role ?? "COMUM",
        };
        try {
            await firebase_1.db.ref(`users/${id}`).set(user);
            await firebase_1.firestore.collection('users').doc(id).set(user);
            console.log("Usuário salvo no Realtime Database e Firestore:", user);
            return user;
        }
        catch (error) {
            console.error("Erro ao salvar usuário:", error);
            throw new Error("Erro ao cadastrar usuário");
        }
    },
    // Busca usuário por e-mail
    async getUserByEmail(email) {
        const snapshot = await firebase_1.db.ref('users')
            .orderByChild('email')
            .equalTo(email)
            .once('value');
        const users = snapshot.val();
        return users ? Object.values(users)[0] : null;
    },
    // Busca usuário por ID
    async getUserById(id) {
        const snapshot = await firebase_1.db.ref(`users/${id}`).once('value');
        return snapshot.val();
    },
    async updateUser(user) {
        await firebase_1.db.ref(`users/${user.id}`).set(user);
        await firebase_1.firestore.collection('users').doc(user.id).set(user);
    },
    // Lista todos os usuários
    async listUsers() {
        const snapshot = await firebase_1.db.ref('users').once('value');
        const usersObj = snapshot.val();
        return usersObj ? Object.values(usersObj) : [];
    },
    // Deleta um usuário por ID
    async deleteUser(userId) {
        try {
            await firebase_1.db.ref(`users/${userId}`).remove();
            await firebase_1.firestore.collection('users').doc(userId).delete();
            return true;
        }
        catch (error) {
            console.error("Erro ao deletar usuário:", error);
            return false;
        }
    },
    // Gera nova senha para o usuário
    async generateNewPassword(userId) {
        const newPassword = Math.random().toString(36).slice(-8); // ex: "x7gj9kfa"
        try {
            const snapshot = await firebase_1.db.ref(`users/${userId}`).once('value');
            const user = snapshot.val();
            if (!user)
                throw new Error("Usuário não encontrado");
            user.password = newPassword;
            await firebase_1.db.ref(`users/${userId}`).set(user);
            await firebase_1.firestore.collection('users').doc(userId).set(user);
            return newPassword;
        }
        catch (error) {
            console.error("Erro ao gerar nova senha:", error);
            throw new Error("Não foi possível gerar nova senha");
        }
    }
};
//# sourceMappingURL=authRepository.js.map