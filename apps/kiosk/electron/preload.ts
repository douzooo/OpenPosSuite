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

//TODO: Cache this and update on changes
contextBridge.exposeInMainWorld('products', {
  getProducts: () => ipcRenderer.invoke('products-get-all'),
  onProducts: (cb: (products: any) => void) => {
    const listener = (_: any, data: any) => cb(data);
    ipcRenderer.on('products', listener);
    return () => ipcRenderer.removeListener('products', listener);
  }
});
