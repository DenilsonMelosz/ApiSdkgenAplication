import { api } from "./generated/api-server";
import { SdkgenHttpServer } from "@sdkgen/node-runtime";
import { signup, login, getProfile, logout } from "./controllers/authController";
import "./config/firebase";
import { Middleware } from "./middleware/Middleware"; // Caminho ajustado se necessário

api.use(Middleware);

// Handlers da API
api.fn.signup = signup;
api.fn.login = login;
api.fn.getProfile = getProfile;
api.fn.logout = logout;

// Inicia o servidor
const server = new SdkgenHttpServer(api);
server.listen(8000);
