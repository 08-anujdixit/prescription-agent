import { Client, Databases, Storage } from "node-appwrite";

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY);

export const databases = new Databases(client);
export const storage = new Storage(client);

// Fill these in with your actual IDs from the Appwrite console
export const DATABASE_ID = "6ab511d90017424c5bf6";
export const PRESCRIPTIONS_TABLE_ID = "6ab5120a003187cd328a";
export const BUCKET_ID = "your_bucket_id_h6ab515a80008b36a5370ere";