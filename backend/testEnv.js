"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
console.log("FIREBASE_ADMIN_PATH:", process.env.FIREBASE_ADMIN_PATH);
console.log("FIREBASE_DATABASE_URL:", process.env.FIREBASE_DATABASE_URL);
//# sourceMappingURL=testEnv.js.map