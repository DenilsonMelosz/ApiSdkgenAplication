import { api } from "./generated/api-server";
import { SdkgenHttpServer } from "@sdkgen/node-runtime";
import { signup, login, getProfile, logout } from "./controllers/authController"; 
import "./config/firebase";

// Atribuindo os handlers às funções da API
api.fn.signup = signup;
api.fn.login = login;
api.fn.getProfile = getProfile;
api.fn.logout = logout;

// Inicia o servidor, na porta 8000
const server = new SdkgenHttpServer(api, {});
server.listen(8000);
