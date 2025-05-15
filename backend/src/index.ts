import { api } from "./generated/api-server";
import { SdkgenHttpServer } from "@sdkgen/node-runtime";
import {  signup,  login,  getProfile,  logout,  updateOwnProfile,  listUsers,  deleteUser,  generateNewPassword} from "./controllers/authController";
import "./config/firebase";
import { Middleware } from "./middleware/Middleware";

api.use(Middleware);

api.fn.signup = signup;
api.fn.login = login;
api.fn.getProfile = getProfile;
api.fn.logout = logout;
api.fn.updateOwnProfile = updateOwnProfile;
api.fn.listUsers = listUsers;
api.fn.deleteUser = deleteUser;
api.fn.generateNewPassword = generateNewPassword;

const server = new SdkgenHttpServer(api);
server.listen(8000);
