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
  //HUMANIZER API
  humanizeText: (payload) => ipcRenderer.invoke("humanizer:process", payload),
  getHumanizerHistory: () => ipcRenderer.invoke("humanizer:getAll"),
  getHumanizerOne: (id) => ipcRenderer.invoke("humanizer:getOne", id),
  deleteHumanizer: (id) => ipcRenderer.invoke("humanizer:delete", id),
  onHumanizerUpdate: (cb) => ipcRenderer.on("humanizer:updated", (e, d) => cb(d)),
  onHumanizerDelete: (cb) => ipcRenderer.on("humanizer:deleted", (e, id) => cb(id)),
});
