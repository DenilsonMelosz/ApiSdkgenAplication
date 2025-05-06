import jwt, { SignOptions } from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "chave_padrao_segura";
const EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";

// Gera um token JWT
export function generateToken(payload: object): string {
    const options: SignOptions = { expiresIn: EXPIRES_IN as SignOptions["expiresIn"] };
    return jwt.sign(payload, JWT_SECRET, options);
}

// Verifica e decodifica um token JWT
export function verifyToken(token: string): { userId: string } {
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
        return decoded;
    } catch (err) {
        throw new Error("Token inválido");
    }
}
