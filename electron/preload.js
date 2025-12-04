// electron/preload.js
import { contextBridge, ipcRenderer } from "electron";
console.log("PRELOAD LOADED");

contextBridge.exposeInMainWorld("electronAPI", {
  // Settings APIs
  getSetting: (key) => ipcRenderer.invoke("settings:get", key),
  setSetting: (key, value) => ipcRenderer.invoke("settings:set", { key, value }),
  getAllSettings: () => ipcRenderer.invoke("settings:getAll"),
  setBulkSettings: (obj) => ipcRenderer.invoke("settings:setBulk", obj),
  deleteSetting: (key) => ipcRenderer.invoke("settings:delete", key),
  generateArticle: (payload) =>
    ipcRenderer.invoke("article:generate", payload),
});
