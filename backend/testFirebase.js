"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const firebase_1 = require("./src/config/firebase");
async function main() {
    const users = await firebase_1.auth.listUsers();
    console.log("Usuários cadastrados:", users.users.map(user => user.email));
}
main().catch(console.error);
//# sourceMappingURL=testFirebase.js.map