import { auth, db, firestore } from "./src/config/firebase";

async function main() {
  const users = await auth.listUsers();
  console.log("Usuários cadastrados:", users.users.map(user => user.email));
}

main().catch(console.error);
