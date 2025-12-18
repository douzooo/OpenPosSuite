import { ipcRenderer, contextBridge } from 'electron'

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld('scu', {
  onStatus: (cb: (status: string) => void) => {
    const listener = (_: any, data: any) => cb(data?.status);
    ipcRenderer.on('scu-status', listener);
    return () => ipcRenderer.removeListener('scu-status', listener);
  },


  // Ask main to immediately send current status event
  requestStatus: () => ipcRenderer.send('scu-request-status'),

  // Get current status as a promise
  getStatus: () => ipcRenderer.invoke('scu-get-status')
});

contextBridge.exposeInMainWorld('log', {
  onLog: (cb: (message: string) => void) => {
    const listener = (_: any, data: any) => cb(data?.message);
    ipcRenderer.on('log-message', listener);
    return () => ipcRenderer.removeListener('log-message', listener);
  },
});
