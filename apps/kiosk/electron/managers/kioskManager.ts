import { Kiosk } from "@openpos/socket-contracts";
import { Screen } from "../../src/state/screens";
import { BrowserWindow } from "electron";
import { ipcMain } from "electron";

class KioskManager {
  //TODO: Store state locally
  kiosk: Kiosk = { setupState: "UNKNOWN", state: "OFFLINE" };
  private mainWindow: BrowserWindow | null = null;

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
    if (this.mainWindow && !this.mainWindow.isDestroyed()) {
      this.mainWindow.webContents.send('kiosk-state-changed', kiosk.state);
    }
  }

  getKioskState() {
    return this.kiosk;
  }
}

export const kioskManager = new KioskManager();

ipcMain.handle('kiosk-get-state', () => {
  return kioskManager.getKioskState();
});