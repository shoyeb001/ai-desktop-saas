import { ipcMain } from "electron";
import Database from 'better-sqlite3';
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// path to db file
const dbPath = path.join(__dirname, "../db/app.db");

// connect
const db = new Database(dbPath);

// init tables
db.exec(`
  CREATE TABLE IF NOT EXISTS settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    key TEXT UNIQUE,
    value TEXT
  );
`);

// expose IPC handler
ipcMain.handle("db:query", (event, { query, params }) => {
    const stmt = db.prepare(query);

    if (query.trim().toLowerCase().startsWith("select")) {
        return stmt.all(params);
    }

    return stmt.run(params);
});
