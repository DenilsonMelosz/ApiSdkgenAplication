"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRepository = void 0;
const firebase_1 = require("../config/firebase");
exports.authRepository = {
    // Criação de usuário com ID específico (com base no Firebase Auth)
    async createUserWithId(id, name, email, password, phone) {
        const user = {
            id,
            name,
            email,
            password,
            phone,
            createdAt: Date.now()
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
    }
};
//# sourceMappingURL=authRepository.js.map