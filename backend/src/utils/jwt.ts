import jwt, { SignOptions } from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "chave_padrao_segura";
const EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";

type JwtPayload = {
  userId: string;
  role: "ADMIN" | "COMUM";
};

// Gerando o token JWT com userId e role
export function generateToken(payload: JwtPayload): string {
    const options: SignOptions = { expiresIn: EXPIRES_IN as SignOptions["expiresIn"] };
    return jwt.sign(payload, JWT_SECRET, options);
}

// Verifica e decodifica o token JWT
export function verifyToken(token: string): JwtPayload {
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
        return decoded;
    } catch (err) {
        throw new Error("Token inválido");
    }
}
