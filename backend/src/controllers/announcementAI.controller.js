const fs = require("fs");
const path = require("path");
const prisma = require("../config/db");

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

function safeParseJSON(text) {
  try {
    const cleaned = text.replace(/```json|```/g, "").trim();
    return JSON.parse(cleaned);
  } catch (err) {
    console.error("❌ Gemini JSON parse failed:", text);
    return null;
  }
}

async function callGemini(payload, retries = 1) {
  try {
    const res = await fetch(GEMINI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(30000),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Gemini API ${res.status}: ${errText}`);
    }

    return await res.json();
  } catch (err) {
    if (retries > 0) {
      console.log("⚠️ Gemini retrying...");
      return callGemini(payload, retries - 1);
    }
    throw err;
  }
}

exports.generateAnnouncementDraft = async (req, res) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return res.status(400).json({
        message: "GEMINI_API_KEY is not configured in backend/.env",
      });
    }

    let { fileIds } = req.body;
    if (!fileIds || (Array.isArray(fileIds) && fileIds.length === 0)) {
      return res.status(400).json({ message: "File IDs required" });
    }
    if (!Array.isArray(fileIds)) {
      fileIds = [fileIds];
    }

    const files = await prisma.uploadedFile.findMany({
      where: { id: { in: fileIds } },
    });

    if (files.length === 0) {
      return res.status(404).json({
        message: "Files not found",
        receivedIds: fileIds,
      });
    }

    const mediaParts = [];

    for (const file of files) {
      const mimeType = file.mimeType || "image/jpeg";
      const supported =
        mimeType.startsWith("image/") || mimeType === "application/pdf";
      if (!supported) continue;

      try {
        let buffer = null;
        if (file.filePath) {
          const localPath = path.join(__dirname, "../../", file.filePath);
          if (fs.existsSync(localPath)) {
            buffer = fs.readFileSync(localPath);
          }
        }

        if (!buffer && file.url && file.url.startsWith("http")) {
          const response = await fetch(file.url);
          if (response.ok) {
            buffer = Buffer.from(await response.arrayBuffer());
          }
        }

        if (buffer) {
          mediaParts.push({
            inlineData: {
              mimeType,
              data: buffer.toString("base64"),
            },
          });
        }
      } catch (err) {
        console.error(`Failed to read file ${file.id}:`, err.message);
      }
    }

    if (mediaParts.length === 0) {
      return res.status(400).json({
        message: "No supported image or PDF files found to analyze.",
      });
    }

    const prompt = `You are an expert assistant helping a faculty member create a student announcement for a college app.

Analyze the uploaded image or PDF document (notice, circular, brochure, poster, exam timetable, or deadline notice).

Extract all visible information and return ONLY a valid JSON object with:
- title: short, clear, specific (max 12 words)
- description: student-friendly summary (2-4 sentences covering who, what, when, where, and key instructions)
- priority: one of "PINNED" (urgent/exams/mandatory), "HIGH" (deadlines/submissions/events), or "INFO" (general updates)
- semester: integer (1-8) ONLY if explicitly mentioned, otherwise null
- deadline: readable date string if visible (e.g. "March 22, 2026"), otherwise null`;

    const payload = {
      contents: [
        {
          parts: [{ text: prompt }, ...mediaParts],
        },
      ],
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 1024,
        responseMimeType: "application/json",
      },
    };

    const geminiData = await callGemini(payload);
    const rawText =
      geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    const parsed = safeParseJSON(rawText);

    if (!parsed) {
      return res.status(500).json({
        message: "AI returned invalid JSON",
      });
    }

    const validPriorities = ["PINNED", "HIGH", "INFO"];
    const priority = validPriorities.includes(parsed.priority)
      ? parsed.priority
      : "INFO";

    return res.json({
      title: parsed.title || "",
      description: parsed.description || "",
      priority,
      semester: parsed.semester ?? null,
      deadline: parsed.deadline ?? null,
    });
  } catch (err) {
    console.error("❌ AI draft error:", err);
    return res.status(500).json({
      message: "AI generation failed",
    });
  }
};

