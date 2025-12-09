import { ipcMain } from "electron";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import path from "path";
import { fileURLToPath } from "url";
import { app } from "electron";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// const dbFile = path.join(__dirname, "../db/settings.json");
const userDataPath = app.getPath("userData");
const dbFile = path.join(userDataPath, "settings.json");
const adapter = new JSONFile(dbFile);

const db = new Low(adapter, {
  geminiApiKey: "",
  firstName: "",
  lastName: "",
  email: "",
  password: "",
});

await db.read();
db.data ||= {
  geminiApiKey: "",
  firstName: "",
  lastName: "",
  email: "",
  password: "",
};

// GET SETTINGS
ipcMain.handle("settings:get", async () => {
  await db.read();
  return db.data;
});

// UPDATE SETTINGS
ipcMain.handle("settings:update", async (event, newSettings) => {
  db.data = { ...db.data, ...newSettings };
  await db.write();
  return { success: true };
});
