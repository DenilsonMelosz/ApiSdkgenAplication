"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Middleware = void 0;
const jwt_1 = require("../utils/jwt");
const api_server_1 = require("../generated/api-server");
const Middleware = async (ctx, next) => {
    console.log(`Confirmando o acesso para função: ${ctx.request.name}`);
    const publicRoutes = ["signup", "login"];
    if (publicRoutes.includes(ctx.request.name)) {
        return await next();
    }
    const authHeader = ctx.request.extra?.Authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new api_server_1.InvalidCredentials("InvalidCredentials", {
            message: "Token de autenticação não fornecido",
        });
    }
    const token = authHeader.replace("Bearer ", "");
    try {
        const payload = (0, jwt_1.verifyToken)(token);
        ctx.request.args.extra = {
            userId: payload.userId,
            role: payload.role,
        };
        return await next();
    }
    catch (err) {
        throw new api_server_1.InvalidCredentials("InvalidCredentials", {
            message: "Token inválido ou expirado",
        });
    }
};
exports.Middleware = Middleware;
//# sourceMappingURL=Middleware.js.map