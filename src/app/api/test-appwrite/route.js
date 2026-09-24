import { databases, DATABASE_ID, PRESCRIPTIONS_TABLE_ID } from "../../lib/appwrite";
import { ID } from "node-appwrite";

export async function GET() {
  try {
    const result = await databases.createDocument(
      DATABASE_ID,
      PRESCRIPTIONS_TABLE_ID,
      ID.unique(),
      {
        medicines: JSON.stringify([{ name: "Test Medicine", dosage: "500mg" }]),
        patientName: "Test Patient",
        shareId: "test123",
      }
    );
    return Response.json({ success: true, result });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}