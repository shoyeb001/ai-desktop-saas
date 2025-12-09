// electron/ipc/article.js
import { ipcMain } from "electron";
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { app } from "electron";
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---- Load Gemini API key from settings.json or env ----
function getGeminiApiKey() {
  try {
    const userDataPath = app.getPath("userData");
    const settingsPath = path.join(userDataPath, "settings.json");
    // const settingsPath = path.join(__dirname, "../db/settings.json");
    if (fs.existsSync(settingsPath)) {
      const raw = fs.readFileSync(settingsPath, "utf-8");
      const json = JSON.parse(raw);
      const key = json?.settings?.geminiApiKey;
      if (key && typeof key === "string" && key.trim().length > 0) {
        return key.trim();
      }
    }
  } catch (err) {
    console.error("Error reading Gemini API key from settings:", err);
  }

  // Fallback to env if not in settings
  if (process.env.GEMINI_API_KEY) {
    return process.env.GEMINI_API_KEY;
  }

  return null;
}

// ---- Build prompt string from form data ----
function buildPromptFromForm(form) {
  const {
    topic,
    minLength,
    maxLength,
    writingStyle,
    keywords,
    generateImage,
  } = form;

  const keywordsText =
    Array.isArray(keywords) && keywords.length
      ? keywords.join(", ")
      : "none specified";

  return `
You are an expert SEO content writer.

Write in a way that closely resembles human writing and reduces the likelihood of AI detection. The goal is to produce academic text that reflects how real content writers in HTML format only.

Do NOT include markdown, only valid HTML tags like <h1>, <p>, <ul>, <li>, <strong>.



Avoid:
- Repetition  
- Overly formal or predictable structure  
- uncommon words and phrases
- Generic AI patterns  
- Mechanical tone  
- Perfectly balanced sentences

- Topic: ${topic}
- Desired minimum length: ${minLength} words
- Desired maximum length: ${maxLength} words
- Writing style / tone: ${writingStyle}
- SEO keywords to naturally include: ${keywordsText}
- Should also generate an image prompt for a hero image: ${generateImage ? "YES" : "NO"}

Additionally:
- Include subtle storytelling elements when relevant.
- Include occasional personal-style observations (without saying “I am an AI”).
- Ensure the article flows in a naturally imperfect, human-driven way.

SEO + Content Requirements:
- Generate an SEO-friendly, click-worthy TITLE (max ~70 characters).
- Generate a compelling META DESCRIPTION (max ~160 characters).
- Generate a well-structured ARTICLE with headings, subheadings, and paragraphs in html format.
- Article should be generated in html format with required h2,h3,h4,p,b tags.
- Article should be human readable, engaging, and not robotic.
- Use keywords naturally, avoid stuffing.
- If image generation is requested, also create a one-sentence image prompt for an AI image model.

OUTPUT FORMAT (VERY IMPORTANT):
Return ONLY a single JSON object with this exact shape, no markdown, no explanation:

{
  "title": string,
  "description": string,
  "article": string,
  "seoKeywords": string[],
  "imagePrompt": string
}

Rules:
- "seoKeywords" should be the important SEO keywords actually used (3–10 items).
- If image generation is NOT requested, set "imagePrompt" to an empty string.
- Do NOT wrap the JSON in backticks.
- Do NOT include any extra text outside the JSON.
`;
}

function buildHumanizerPrompt(articleText) {
  return `Humanize the ai generated text so that it pass the ai detectors and make it in html format as it is.

CONTENT TO REWRITE:
"""
${articleText}
"""
OUTPUT FORMAT (VERY IMPORTANT):
Return ONLY the rewrited html of article, no markdown, no explanation:
`;
}

// ---- IPC handler to generate article ----
ipcMain.handle("article:generate", async (event, formData) => {
  const apiKey = getGeminiApiKey();

  if (!apiKey) {
    throw new Error(
      "Gemini API key is not configured. Please set it in Settings or GEMINI_API_KEY env."
    );
  }

  try {
    // Init Gemini client
    const genAI = new GoogleGenerativeAI(apiKey);

    // Use a current fast model; adjust if you prefer Pro/etc.
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const userPrompt = buildPromptFromForm(formData);

    const result1 = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: userPrompt }],
        },
      ],
      // JSON Mode – ask the model to return proper JSON only :contentReference[oaicite:1]{index=1}
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            title: { type: "string" },
            description: { type: "string" },
            article: { type: "string" },
            seoKeywords: {
              type: "array",
              items: { type: "string" },
            },
            imagePrompt: { type: "string" },
          },
          required: ["title", "description", "article", "seoKeywords"],
        },
      },
    });

     let rawText1 = result1.response.text();

    let articleJson;
    try {
      articleJson = JSON.parse(rawText1);
    } catch (err) {
      console.error("Invalid JSON from generation:", rawText1);
      throw new Error("AI did not return valid JSON.");
    }

    // ---------------- STEP 2: Humanize the article ----------------
    const humanizerPrompt = buildHumanizerPrompt(articleJson.article);

    const result2 = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: humanizerPrompt }] }],
      generationConfig: {
        responseMimeType: "text/plain"
      }
    });

    const finalHumanizedText = result2.response.text().trim();

    // Inject the humanized version back into the object
    const finalOutput = {
      ...articleJson,
      article: finalHumanizedText,
    };

    return finalOutput;
  } catch (err) {
    console.error("Error in article pipeline:", err);
    throw new Error("Failed to generate article: " + err.message);
  }
});
