/* ───────────────────────────────────────────────────────
   MongoDB Atlas Connection — Singleton client for Next.js
   ─────────────────────────────────────────────────────── */

import { MongoClient, Db } from "mongodb";

const uri = process.env.MONGODB_URI || "";
const dbName = process.env.MONGODB_DB_NAME || "riveohealth";

// Don't throw at module load time — this breaks static page generation during build
// The error will surface when getDb() is actually called at runtime

const options = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

// Use global variable in dev to preserve connection across hot reloads
const globalWithMongo = global as typeof globalThis & {
  _mongoClientPromise?: Promise<MongoClient>;
};

function getClientPromise(): Promise<MongoClient> {
  if (!uri) {
    return Promise.reject(new Error("MONGODB_URI is not defined"));
  }
  if (process.env.NODE_ENV === "development") {
    if (!globalWithMongo._mongoClientPromise) {
      const client = new MongoClient(uri, options);
      globalWithMongo._mongoClientPromise = client.connect();
    }
    return globalWithMongo._mongoClientPromise;
  }
  const client = new MongoClient(uri, options);
  return client.connect();
}

const clientPromise = uri ? getClientPromise() : Promise.reject(new Error("MONGODB_URI not set"));

export default clientPromise;

export async function getDb(): Promise<Db> {
  const client = await clientPromise;
  return client.db(dbName);
}

// ── Collection helpers ─────────────────────────────────
export async function getCollection(name: string) {
  const db = await getDb();
  return db.collection(name);
}

// ── Collection names (centralized) ─────────────────────
export const Collections = {
  CONTACTS: "contacts",
  DEMO_REQUESTS: "demo_requests",
  AUDIT_REQUESTS: "audit_requests",
  AUDIT_RESULTS: "audit_results",
  ORGANIZATIONS: "organizations",
  USERS: "users",
  CLAIMS: "claims",
  DENIALS: "denials",
  PAYERS: "payers",
  AUDIT_LOG: "audit_log",
} as const;
