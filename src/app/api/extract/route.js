import { GoogleGenerativeAI } from "@google/generative-ai";
console.log("API KEY LOADED:", process.env.GEMINI_API_KEY ? "YES, starts with " + process.env.GEMINI_API_KEY.slice(0, 6) : "NO — KEY IS UNDEFINED");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Ordered by preference: most reliable/stable first, newest/highest-demand last
const MODELS_TO_TRY = [
  "gemini-3.1-flash-lite",
  "gemini-3-flash-preview",
  "gemini-flash-latest",
  "gemini-3.6-flash",
];

const EXTRACTION_PROMPT = `You are analyzing a prescription image. Extract medicine details and return ONLY valid JSON, no markdown formatting, no explanation text — just the raw JSON object, in this exact structure:
{
  "medicines": [
    {
      "name": "",
      "dosage": "",
      "frequency": "",
      "duration": "",
      "timing": "",
      "instructions": ""
    }
  ]
}
If the image is unclear or a field cannot be determined, use an empty string for that field. Do not guess or diagnose anything — only extract what is written.`;

async function generateWithFallback(imageBase64) {
  let lastError;

  for (const modelName of MODELS_TO_TRY) {
    try {
      console.log(`Trying model: ${modelName}`);
      const model = genAI.getGenerativeModel({ model: modelName });

      const result = await model.generateContent([
        EXTRACTION_PROMPT,
        { inlineData: { mimeType: "image/jpeg", data: imageBase64 } },
      ]);

      console.log(`Success with model: ${modelName}`);
      return result;
    } catch (error) {
      console.log(`Model ${modelName} failed: ${error.message}`);
      lastError = error;
      // Continue to the next model in the list
    }
  }

  // If every model failed, throw the last error so it's visible in the response
  throw lastError;
}

export async function POST(req) {
  try {
    const { imageBase64 } = await req.json();

    if (!imageBase64) {
      return Response.json(
        { success: false, error: "No image provided" },
        { status: 400 }
      );
    }

    const result = await generateWithFallback(imageBase64);

    const text = result.response.text().replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(text);

    return Response.json({ success: true, data: parsed });
  } catch (error) {
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}