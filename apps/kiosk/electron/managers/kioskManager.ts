import { Kiosk, KioskConfig } from "@openpos/socket-contracts";
import { Screen } from "../../src/state/screens";
import { BrowserWindow } from "electron";
import { ipcMain } from "electron";
import Store from "electron-store";
import { OrderItem } from "../../src/hooks/useOrder";
import { scuManager } from "./scuManager";

class KioskManager {
  private store: Store<{ kioskConfig: KioskConfig }>;
  kiosk: Kiosk;
  private mainWindow: BrowserWindow | null = null;

  constructor() {
    this.store = new Store<{ kioskConfig: KioskConfig }>({
      defaults: {
        kioskConfig: {},
      },
    });
    
    // Load persisted state
    const config = this.store.get("kioskConfig");
    this.kiosk = {
      ...config,
      setupState: config.deviceId ? 'PENDING' : (config.kioskId ? 'REGISTERED' : 'UNKNOWN'),
      state: "ONLINE",
    };
    console.log("Loaded kiosk config:", this.kiosk);
  }

  registerTemporary(temporaryId: string, kioskInfo: Partial<Kiosk>) {
    this.kiosk = {
      ...this.kiosk,
      ...kioskInfo,
      deviceId: temporaryId,
      setupState: "PENDING",
    };
    this.store.set("kioskConfig", this.kiosk);
  }



  setMainWindow(window: BrowserWindow) {
    this.mainWindow = window;
  }

  show(screen: Screen) {
    if (this.mainWindow && !this.mainWindow.isDestroyed()) {
      this.mainWindow.webContents.send('show-screen', screen);
    }
  }

  setFullscreen(enable: boolean) {
    if (this.mainWindow && !this.mainWindow.isDestroyed()) {
      this.mainWindow.setFullScreen(enable);
    }
  }

  updateKioskState(kiosk: Kiosk) {
    this.kiosk = kiosk;
    this.store.set("kioskConfig", kiosk); // Persist to disk
    if (this.mainWindow && !this.mainWindow.isDestroyed()) {
      this.mainWindow.webContents.send('kiosk-state-changed', kiosk.state);
    }
  }

  getKioskState() {
    return this.kiosk;
  }

  //TODO: Make new type for Order which can contain extra info
  sendOrderRequest(items: OrderItem[]){
    
  }
}

export const kioskManager = new KioskManager();

ipcMain.handle('kiosk-get-state', () => {
  return kioskManager.getKioskState();
});