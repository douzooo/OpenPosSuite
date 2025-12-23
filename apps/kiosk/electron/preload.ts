import { ipcRenderer, contextBridge } from 'electron';

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld('scu', {
  onStatus: (cb: (status: string) => void) => {
    const listener = (_: any, data: any) => cb(data?.status);
    ipcRenderer.on('scu-status', listener);
    return () => ipcRenderer.removeListener('scu-status', listener);
  },
  requestStatus: () => ipcRenderer.send('scu-request-status'),
  getStatus: () => ipcRenderer.invoke('scu-get-status')
});

contextBridge.exposeInMainWorld('log', {
  onLog: (cb: (message: string) => void) => {
    const listener = (_: any, data: any) => cb(data?.message);
    ipcRenderer.on('log-message', listener);
    return () => ipcRenderer.removeListener('log-message', listener);
  }
});
