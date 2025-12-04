// electron/main.js
import { app, BrowserWindow } from "electron";
import path from "path";
import { fileURLToPath } from "url";

// import IPC handlers (registers them)
import "./ipc/setting.js";
import "./ipc/article.js"; 


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow = null;

function createWindow() {
  const preloadPath = path.resolve(__dirname, "preload.js");
  console.log("PRELOAD PATH:", preloadPath);
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    backgroundColor: "#0f0f0f",
    titleBarStyle: "hiddenInset",
    webPreferences: {
     preload: preloadPath,
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,               // ← REQUIRED for Vite dev mode
      webSecurity: false,           // ← Prevents Vite CORS issues
    },
  });

  const isDev = !app.isPackaged;

  if (isDev) {
    mainWindow.loadURL("http://localhost:5173");
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, "../frontend/dist/index.html"));
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
