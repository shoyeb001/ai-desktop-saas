// electron/preload.js
import { contextBridge, ipcRenderer } from "electron";
console.log("PRELOAD LOADED");

contextBridge.exposeInMainWorld("electronAPI", {
  // ARTICLE
  generateArticle: (payload) =>
    ipcRenderer.invoke("article:generate", payload),
   // HISTORY
  saveArticleHistory: (payload) => ipcRenderer.invoke("history:saveArticle", payload),
  getHistory: () => ipcRenderer.invoke("history:getAll"),
  getHistoryItem: (id) => ipcRenderer.invoke("history:getOne", id),
    onHistoryUpdate: (callback) => ipcRenderer.on("history:updated", (event, data) => callback(data)),
  deleteHistory: (id) => ipcRenderer.invoke("history:delete", id),
  onHistoryDeleted: (callback) =>
  ipcRenderer.on("history:deleted", (event, id) => callback(id)),
  //SETTINGS API
  getSettings: () => ipcRenderer.invoke("settings:get"),
  updateSettings: (payload) => ipcRenderer.invoke("settings:update", payload),

});
