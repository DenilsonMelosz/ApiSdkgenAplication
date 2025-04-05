import { initializeApp, cert, getApps, getApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getDatabase } from "firebase-admin/database";
import { getFirestore } from "firebase-admin/firestore";
import dotenv from "dotenv";
import * as fs from "fs";

dotenv.config();

// Encaminhando a leitura dos dados no caminho do .env 
const serviceAccountPath = process.env.FIREBASE_ADMIN_PATH!;
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf-8"));

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
