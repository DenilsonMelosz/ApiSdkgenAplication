import { auth } from "../config/firebase";
import { authRepository } from "../repository/authRepository";

async function createAdmin() {
  const name = "Admin Developer";
  const email = "admindeveloper@gmail.com";
  const password = "admin123";
  const phone = "+5571992660009"; 
  const role: "ADMIN" = "ADMIN";

  try {
    // Criando usuário no Firebase Auth
    const userRecord = await auth.createUser({
      email,
      password,
      displayName: name,
      phoneNumber: phone,
    });

    // Criando usuário no banco de dados
    await authRepository.createUserWithId(
      userRecord.uid,
      name,
      email,
      password,
      phone,
      role
    );

    console.log(" Usuário admin criado com sucesso!");
  } catch (err: any) {
    console.error(" Erro ao criar usuário admin:", err.message || err);
  }
}

createAdmin();
