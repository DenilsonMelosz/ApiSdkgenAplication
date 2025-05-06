"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.firestore = exports.db = exports.auth = void 0;
const app_1 = require("firebase-admin/app");
const auth_1 = require("firebase-admin/auth");
const database_1 = require("firebase-admin/database");
const firestore_1 = require("firebase-admin/firestore");
const dotenv_1 = __importDefault(require("dotenv"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
// Carrega o .env
dotenv_1.default.config();
// Caminho relativo que veio do .env
const serviceAccountPath = process.env.FIREBASE_ADMIN_PATH;
if (!serviceAccountPath) {
    throw new Error("FIREBASE_ADMIN_PATH não definido no .env");
}
// Resolve para caminho absoluto a partir da raiz do projeto
const absolutePath = path.resolve(__dirname, "../../", serviceAccountPath);
// Lê o JSON com caminho absoluto
const serviceAccount = JSON.parse(fs.readFileSync(absolutePath, "utf-8"));
const app = (0, app_1.getApps)().length === 0
    ? (0, app_1.initializeApp)({
        credential: (0, app_1.cert)(serviceAccount),
        databaseURL: process.env.FIREBASE_DATABASE_URL,
    })
    : (0, app_1.getApp)();
const auth = (0, auth_1.getAuth)(app);
exports.auth = auth;
const db = (0, database_1.getDatabase)(app);
exports.db = db;
const firestore = (0, firestore_1.getFirestore)(app);
exports.firestore = firestore;
//# sourceMappingURL=firebase.js.map