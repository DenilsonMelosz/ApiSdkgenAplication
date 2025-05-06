"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_server_1 = require("./generated/api-server");
const node_runtime_1 = require("@sdkgen/node-runtime");
const authController_1 = require("./controllers/authController");
require("./config/firebase");
const Middleware_1 = require("./middleware/Middleware"); // Caminho ajustado se necessário
api_server_1.api.use(Middleware_1.Middleware);
// Handlers da API
api_server_1.api.fn.signup = authController_1.signup;
api_server_1.api.fn.login = authController_1.login;
api_server_1.api.fn.getProfile = authController_1.getProfile;
api_server_1.api.fn.logout = authController_1.logout;
// Inicia o servidor
const server = new node_runtime_1.SdkgenHttpServer(api_server_1.api);
server.listen(8000);
//# sourceMappingURL=index.js.map