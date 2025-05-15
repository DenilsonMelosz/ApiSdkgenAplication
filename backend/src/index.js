"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_server_1 = require("./generated/api-server");
const node_runtime_1 = require("@sdkgen/node-runtime");
const authController_1 = require("./controllers/authController");
require("./config/firebase");
const Middleware_1 = require("./middleware/Middleware");
api_server_1.api.use(Middleware_1.Middleware);
api_server_1.api.fn.signup = authController_1.signup;
api_server_1.api.fn.login = authController_1.login;
api_server_1.api.fn.getProfile = authController_1.getProfile;
api_server_1.api.fn.logout = authController_1.logout;
api_server_1.api.fn.updateOwnProfile = authController_1.updateOwnProfile;
api_server_1.api.fn.listUsers = authController_1.listUsers;
api_server_1.api.fn.deleteUser = authController_1.deleteUser;
api_server_1.api.fn.generateNewPassword = authController_1.generateNewPassword;
const server = new node_runtime_1.SdkgenHttpServer(api_server_1.api);
server.listen(8000);
//# sourceMappingURL=index.js.map