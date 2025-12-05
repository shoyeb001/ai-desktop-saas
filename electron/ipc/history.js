import { ipcMain } from "electron";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import path from "path";
import { fileURLToPath } from "url";
import { v4 as uuidv4 } from "uuid";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// DB PATH
const dbFile = path.join(__dirname, "../db/history.json");
const adapter = new JSONFile(dbFile);
const db = new Low(adapter, { articles: [] });

// Load DB
await db.read();
db.data ||= { articles: [] };

// --------------------------------------------
// SAVE ARTICLE TO HISTORY
// --------------------------------------------
ipcMain.handle("history:saveArticle", async (event, articleObj) => {
  const id = uuidv4();

  const entry = {
    id,
    title: articleObj.title,
    topic: articleObj.topic,
    createdAt: Date.now(),
    response: articleObj.response, // full article JSON
  };

  db.data.articles.push(entry);
  await db.write();
  event.sender.send("history:updated", entry);


  return { success: true, id };
});

// --------------------------------------------
// GET ALL HISTORY
// --------------------------------------------
ipcMain.handle("history:getAll", async () => {
  await db.read();
  return db.data.articles.sort((a, b) => b.createdAt - a.createdAt);
});

// --------------------------------------------
// GET ONE ARTICLE BY ID
// --------------------------------------------
ipcMain.handle("history:getOne", async (event, id) => {
  await db.read();
  return db.data.articles.find((a) => a.id === id);
});

ipcMain.handle("history:delete", async (event, id) => {
  await db.read();

  const index = db.data.articles.findIndex((a) => a.id === id);
  if (index === -1) return { success: false };

  const deletedItem = db.data.articles.splice(index, 1)[0];
  await db.write();

  // Notify frontend sidebar to update
  event.sender.send("history:deleted", id);

  return { success: true, deletedId: id };
});
