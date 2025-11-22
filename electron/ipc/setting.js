// electron/ipc/settings.js
import { ipcMain } from "electron";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure db directory exists
const dbDir = path.join(__dirname, "../db");
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Path to JSON DB file
const dbFile = path.join(dbDir, "settings.json");

// Create LowDB adapter & instance
const adapter = new JSONFile(dbFile);

// Default structure
const DEFAULT_DATA = {
  // settings will be a key-value map
  settings: {
    // example default keys (empty by default)
    geminiApiKey: "",
    openaiApiKey: "",
    anthropicApiKey: "",
    organizationName: "",
    email: "",
    password: ""
  }
};
const db = new Low(adapter, DEFAULT_DATA);


// Initialize DB (async)
let initPromise = (async function init() {
  await db.read();
  if (!db.data) {
    db.data = DEFAULT_DATA;
    await db.write();
  } else {
    // ensure keys exist
    if (typeof db.data.settings !== "object") db.data.settings = {};
    // merge defaults for any missing keys
    db.data.settings = { ...DEFAULT_DATA.settings, ...db.data.settings };
    await db.write();
  }
})();

// Helper to ensure DB ready
async function ensureDb() {
  return initPromise;
}

// IPC handlers

// get single setting by key, returns null if not found
ipcMain.handle("settings:get", async (event, key) => {
  await ensureDb();
  return db.data.settings.hasOwnProperty(key) ? db.data.settings[key] : null;
});

// set single setting (key, value)
ipcMain.handle("settings:set", async (event, { key, value }) => {
  await ensureDb();
  db.data.settings[key] = value;
  await db.write();
  return true;
});

// set multiple settings at once (object)
ipcMain.handle("settings:setBulk", async (event, obj) => {
  await ensureDb();
  if (obj && typeof obj === "object") {
    db.data.settings = { ...db.data.settings, ...obj };
    await db.write();
    return true;
  }
  return false;
});

// delete a setting
ipcMain.handle("settings:delete", async (event, key) => {
  await ensureDb();
  if (db.data.settings.hasOwnProperty(key)) {
    delete db.data.settings[key];
    await db.write();
    return true;
  }
  return false;
});

// get all settings as an object
ipcMain.handle("settings:getAll", async () => {
  await ensureDb();
  // return a shallow copy so renderer can't mutate internal object directly
  return { ...db.data.settings };
});
