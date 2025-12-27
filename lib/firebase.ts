import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const db = getFirestore(app);
export const storage = getStorage(app);

export type LeadStatus = "new" | "in_progress" | "closed";

export interface Lead {
  id: string;
  name?: string;
  email?: string;
  whatsapp?: string;
  message?: string;
  createdAt?: Date;
  status?: LeadStatus;
  dealValue?: number;
  source?: string;
}

export type TargetStatus = "pending" | "contacted" | "follow_up" | "closed";

export interface Target {
  id: string;
  company: string;
  contact?: string;
  status: TargetStatus;
  notes?: string;
  createdAt?: Date;
}

export interface Audit {
  id: string;
  company: string;
  filePath: string;
  url: string;
  notes?: string;
  createdAt?: Date;
}

