// electron/ipc/article.js
import { ipcMain } from "electron";
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---- Load Gemini API key from settings.json or env ----
function getGeminiApiKey() {
  try {
    const settingsPath = path.join(__dirname, "../db/settings.json");
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

Write in a way that closely resembles human academic writing and reduces the likelihood of AI detection. The goal is to produce academic text that reflects how real content writers in HTML format only.

Do NOT include markdown, only valid HTML tags like <h1>, <p>, <ul>, <li>, <strong>.

The final writing must reflect:
- Human reasoning, small imperfections, and unique expression  
- Varying sentence lengths and rhythm  
- Occasional reflective thoughts, rhetorical questions, or mild emotions  
- Personal-style insights or relatable examples  
- Natural transitions, not AI-like connectors ("moreover", "furthermore" etc.)  
- No generic summarizing phrases like “In conclusion”
- Vary sentence length and syntactic structure throughout the text to avoid rhythmic uniformity
- Avoid starting all sentences or paragraphs the same way; use a range of openings to create natural flow
- Use hedging language to express intellectual caution, such as modal verbs and qualifiers, rather than absolute claims
- Integrate theoretical framing and critical perspective, rather than merely summarising sources or claims
- Situate ideas within ongoing scholarly conversations by referencing debates, tensions, or differing perspectives
- Use precise, discipline-appropriate vocabulary that reflects conceptual clarity and field-specific knowledge
- Avoid vague generalisations or filler phrases that contribute little to the argument
- Vary the way citations are used and embed them naturally in the discussion, rather than mechanically attaching them to summary statements
- Avoid repetitive patterns in grammar, punctuation, and connector words; maintain stylistic and rhetorical variation
- Vary sentence length and structure, including the number and types of clauses. Incorporate both active and passive voice where appropriate
- Ensure the writing demonstrates depth of understanding, positioning the writer as an active participant in the academic dialogue
- Do not use em dashes or overuse words and expressions that are commonly identified as AI text giveaway
- Write with personality but remain professional and high-quality.

Avoid:
- Repetition  
- Overly formal or predictable structure  
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
