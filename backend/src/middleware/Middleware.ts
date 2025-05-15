import { verifyToken } from "../utils/jwt";
import { InvalidCredentials } from "../generated/api-server";

export const Middleware = async (ctx: any, next: () => Promise<any>) => {
  console.log(`Confirmando o acesso para função: ${ctx.request.name}`);

  const publicRoutes = ["signup", "login"];

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

    ctx.request.args.extra = {
      userId: payload.userId,
      role: payload.role,
    };

    return await next();
  } catch (err) {
    throw new InvalidCredentials("InvalidCredentials", {
      message: "Token inválido ou expirado",
    });
  }
};

