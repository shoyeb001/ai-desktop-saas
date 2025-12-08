import { ipcMain } from "electron";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import path from "path";
import { fileURLToPath } from "url";
import { v4 as uuidv4 } from "uuid";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Load Settings DB for Gemini Key ---
const settingsFile = path.join(__dirname, "../db/settings.json");
const settingsDB = new Low(new JSONFile(settingsFile), {});
await settingsDB.read();

// --- Load Humanizer History DB ---
const dbFile = path.join(__dirname, "../db/humanizer.json");
const db = new Low(new JSONFile(dbFile), { history: [] });
await db.read();
db.data ||= { history: [] };

// --- Humanizer Processor ---
ipcMain.handle("humanizer:process", async (event, payload) => {
  const { text, tone, style } = payload;

  if (!settingsDB.data.geminiApiKey)
    return { error: "Gemini API key not set in Settings." };

  const genAI = new GoogleGenerativeAI(settingsDB.data.geminiApiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `
Rewrite & humanize the following text to make it sound more natural, expressive, and human-like so that it can pass the ai detection test.  
Apply a **${tone}** tone with a **${style}** writing style.  
Improve clarity, remove robotic phrasing, vary sentence structure, and keep the meaning unchanged.

Text:
"""${text}"""
`;

  const response = await model.generateContent(prompt);
  const result = response.response.text();

  // Save to history
  const entry = {
    id: uuidv4(),
    input: text,
    output: result,
    tone,
    style,
    createdAt: Date.now(),
  };

  db.data.history.push(entry);
  await db.write();

  // Send real-time update to frontend
  event.sender.send("humanizer:updated", entry);

  return { result, id: entry.id };
});

// --- Get All History ---
ipcMain.handle("humanizer:getAll", async () => {
  await db.read();
  return db.data.history.sort((a, b) => b.createdAt - a.createdAt);
});

// --- Get Single History ---
ipcMain.handle("humanizer:getOne", async (e, id) => {
  await db.read();
  return db.data.history.find((x) => x.id === id);
});

// --- Delete Item ---
ipcMain.handle("humanizer:delete", async (e, id) => {
  await db.read();
  db.data.history = db.data.history.filter((x) => x.id !== id);
  await db.write();
  e.sender.send("humanizer:deleted", id);
  return { success: true };
});
