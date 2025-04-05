import { db, firestore } from '../config/firebase'; 

interface DatabaseUser {
  id: string;
  name: string;
  email: string;
  password: string; 
  phone: string;
  createdAt: number;
}

export const authRepository = {
  // Método para criar um usuário com ID específico , novo método
  async createUserWithId(id: string, name: string, email: string, password: string, phone: string): Promise<DatabaseUser> {
    const user: DatabaseUser = {
      id,
      name,
      email,
      password,
      phone,
      createdAt: Date.now()
    };

    try {
      await db.ref(`users/${id}`).set(user);
      await firestore.collection('users').doc(id).set(user);

      console.log(" Usuário salvo no Realtime Database e Firestore:", user);
      return user;
    } catch (error) {
      console.error(" Erro ao salvar usuário:", error);
      throw new Error("Erro ao cadastrar usuário");
    }
  },

  // Método antigo 
  async createUser(name: string, email: string, password: string, phone: string): Promise<DatabaseUser> {
    const userRef = db.ref('users').push();
    const user: DatabaseUser = {
      id: userRef.key as string,
      name,
      email,
      password, 
      phone,
      createdAt: Date.now()
    };

    try {
      await userRef.set(user);
      await firestore.collection('users').doc(user.id).set(user);
      console.log(" Usuário salvo no Firebase (Realtime e Firestore):", user);
      return user;
    } catch (error) {
      console.error(" Erro ao salvar usuário:", error);
      throw new Error("Erro ao cadastrar usuário");
    }
  },

  // Busca usuário por email
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
  }
};
