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

// --- CRM (INTEL) ---
export type LeadStatus = "new" | "contacted" | "negotiating" | "won" | "lost";

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

// --- OPS (OPERATIONS) ---
export type ProjectStatus = 
  | "lead" 
  | "negotiation" 
  | "development" 
  | "qa" 
  | "deployment" 
  | "maintenance" 
  | "completed" 
  | "archived";

export interface Project {
  id: string;
  name: string; // Internal codename or project name
  clientName: string;
  status: ProjectStatus;
  startDate?: Date;
  deadline?: Date;
  techStack?: string[]; // e.g. ["Next.js", "Firebase"]
  repositoryUrl?: string;
  totalValue?: number;
  currency?: string; // "USD", "ARS"
  notes?: string;
  createdAt?: Date;
}

// --- TREASURY (FINANCE) ---
export type TransactionType = "income" | "expense";
export type TransactionCategory = 
  | "project_payment" 
  | "hosting" 
  | "software_license" 
  | "contractor" 
  | "marketing" 
  | "other";

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: TransactionCategory;
  date: Date;
  relatedProjectId?: string; // Link to a project if applicable
  createdAt?: Date;
}

// --- SETTINGS (SYSTEM) ---
export interface SystemSettings {
  id: string; // usually "global_settings"
  monthlyRevenueGoal: number;
  currency: string;
  lastUpdated?: Date;
}

// --- LEGACY / ARCHIVES ---
export interface Audit {
  id: string;
  company: string;
  filePath: string;
  url: string;
  notes?: string;
  createdAt?: Date;
}

// Deprecated: Migrating to Project
export type TargetStatus = "pending" | "contacted" | "follow_up" | "closed";
export interface Target {
  id: string;
  company: string;
  contact?: string;
  status: TargetStatus;
  notes?: string;
  createdAt?: Date;
}

