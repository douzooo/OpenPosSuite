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
electron.contextBridge.exposeInMainWorld("products", {
  getProducts: () => electron.ipcRenderer.invoke("products-get-all"),
  onProducts: (cb) => {
    const listener = (_, data) => cb(data);
    electron.ipcRenderer.on("products", listener);
    return () => electron.ipcRenderer.removeListener("products", listener);
  }
});
electron.contextBridge.exposeInMainWorld("screenManager", {
  onShowScreen: (callback) => {
    const listener = (_, data) => {
      callback(data);
    };
    electron.ipcRenderer.on("show-screen", listener);
    return () => electron.ipcRenderer.removeListener("show-screen", listener);
  }
});
electron.contextBridge.exposeInMainWorld("kiosk", {
  onStateChange: (callback) => {
    const listener = (_, kiosk) => {
      callback(kiosk);
    };
    electron.ipcRenderer.on("kiosk-state-changed", listener);
    return () => electron.ipcRenderer.removeListener("kiosk-state-changed", listener);
  },
  getState: () => electron.ipcRenderer.invoke("kiosk-get-state")
});
