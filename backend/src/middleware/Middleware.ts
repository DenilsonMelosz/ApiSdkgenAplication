import { verifyToken } from "../utils/jwt";
import { InvalidCredentials } from "../generated/api-server";

// Funções públicas que não exigem autenticação
const publicRoutes = ["signup", "login"];

export const Middleware = async (ctx: any, next: () => Promise<any>) => {

  // Permitindo as chamadas públicas
  if (publicRoutes.includes(ctx.request.name)) {
    return await next();
  }

  const authHeader = ctx.request.extra?.Authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new InvalidCredentials("InvalidCredentials", {
      message: "Token de autenticação não fornecido",
    });
  }

  const token = authHeader.replace("Bearer ", "");

  try {
    const payload = verifyToken(token);
    ctx.request.args.userId = payload.userId;

    const reply = await next();
    return reply;
  } catch (err) {
    throw new InvalidCredentials("InvalidCredentials", {
      message: "Token inválido ou expirado",
    });
  }
};
