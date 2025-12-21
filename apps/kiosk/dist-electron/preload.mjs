"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("scu", {
  onStatus: (cb) => {
    const listener = (_, data) => cb(data == null ? void 0 : data.status);
    electron.ipcRenderer.on("scu-status", listener);
    return () => electron.ipcRenderer.removeListener("scu-status", listener);
  },
  requestStatus: () => electron.ipcRenderer.send("scu-request-status"),
  getStatus: () => electron.ipcRenderer.invoke("scu-get-status")
});
electron.contextBridge.exposeInMainWorld("log", {
  onLog: (cb) => {
    const listener = (_, data) => cb(data == null ? void 0 : data.message);
    electron.ipcRenderer.on("log-message", listener);
    return () => electron.ipcRenderer.removeListener("log-message", listener);
  }
});
