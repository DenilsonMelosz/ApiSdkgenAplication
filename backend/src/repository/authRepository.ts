import { db, firestore } from '../config/firebase';

interface DatabaseUser {
  id: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  createdAt: number;
  role: "ADMIN" | "COMUM";
}

export const authRepository = {
  // Criação de usuário com ID específico
  async createUserWithId(
    id: string,
    name: string,
    email: string,
    password: string,
    phone: string,
    role: "ADMIN" | "COMUM" = "COMUM"
  ): Promise<DatabaseUser> {
    const user: DatabaseUser = {
      id,
      name,
      email,
      password,
      phone,
      createdAt: Date.now(),
      role: role ?? "COMUM",
    };

    try {
      await db.ref(`users/${id}`).set(user);
      await firestore.collection('users').doc(id).set(user);

      console.log("Usuário salvo no Realtime Database e Firestore:", user);
      return user;
    } catch (error) {
      console.error("Erro ao salvar usuário:", error);
      throw new Error("Erro ao cadastrar usuário");
    }
  },

  // Busca usuário por e-mail
  async getUserByEmail(email: string): Promise<DatabaseUser | null> {
    const snapshot = await db.ref('users')
      .orderByChild('email')
      .equalTo(email)
      .once('value');

    const users = snapshot.val();
    return users ? Object.values(users)[0] as DatabaseUser : null;
  },

  // Busca usuário por ID
  async getUserById(id: string): Promise<DatabaseUser | null> {
    const snapshot = await db.ref(`users/${id}`).once('value');
    return snapshot.val();
  },

  async updateUser(user: DatabaseUser): Promise<void> {
  await db.ref(`users/${user.id}`).set(user);
  await firestore.collection('users').doc(user.id).set(user);
},

  // Lista todos os usuários
  async listUsers(): Promise<DatabaseUser[]> {
    const snapshot = await db.ref('users').once('value');
    const usersObj = snapshot.val();
    return usersObj ? Object.values(usersObj) as DatabaseUser[] : [];
  },

  // Deleta um usuário por ID
  async deleteUser(userId: string): Promise<boolean> {
    try {
      await db.ref(`users/${userId}`).remove();
      await firestore.collection('users').doc(userId).delete();
      return true;
    } catch (error) {
      console.error("Erro ao deletar usuário:", error);
      return false;
    }
  },

  // Gera nova senha para o usuário
  async generateNewPassword(userId: string): Promise<string> {
    const newPassword = Math.random().toString(36).slice(-8); // ex: "x7gj9kfa"
    try {
      const snapshot = await db.ref(`users/${userId}`).once('value');
      const user = snapshot.val();
      if (!user) throw new Error("Usuário não encontrado");

      user.password = newPassword;

      await db.ref(`users/${userId}`).set(user);
      await firestore.collection('users').doc(userId).set(user);

      return newPassword;
    } catch (error) {
      console.error("Erro ao gerar nova senha:", error);
      throw new Error("Não foi possível gerar nova senha");
    }
  }
};
