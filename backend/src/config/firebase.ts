import { initializeApp, cert, getApps, getApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getDatabase } from "firebase-admin/database";
import { getFirestore } from "firebase-admin/firestore";
import dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";

// Carrega o .env
dotenv.config();

// Caminho relativo que veio do .env
const serviceAccountPath = process.env.FIREBASE_ADMIN_PATH;

if (!serviceAccountPath) {
  throw new Error("FIREBASE_ADMIN_PATH não definido no .env");
}

// Resolve para caminho absoluto a partir da raiz do projeto
const absolutePath = path.resolve(__dirname, "../../", serviceAccountPath);

// Lê o JSON com caminho absoluto
const serviceAccount = JSON.parse(fs.readFileSync(absolutePath, "utf-8"));

const app = getApps().length === 0
  ? initializeApp({
      credential: cert(serviceAccount),
      databaseURL: process.env.FIREBASE_DATABASE_URL,
    })
  : getApp();

const auth = getAuth(app);
const db = getDatabase(app);
const firestore = getFirestore(app);

export { auth, db, firestore };
