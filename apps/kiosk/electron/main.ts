import { app, BrowserWindow, ipcMain, screen } from "electron";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { resolveSMU } from "./smuResolver";
import { Socket } from "socket.io-client";
import { ClientToServerEvents, ServerToClientEvents } from "@openpos/socket-contracts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

process.env.APP_ROOT = path.join(__dirname, "..");

export const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
export const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
export const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, "public")
  : RENDERER_DIST;

let win: BrowserWindow | null;

function createWindow() {
  const displays = screen.getAllDisplays();
  let targetDisplay = displays[0];

  // Find first vertical screen
  for (const display of displays) {
    if (display.bounds.height > display.bounds.width) {
      targetDisplay = display;
      break;
    }
  }

  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    frame: false,
    resizable: false,
    transparent: true,
    roundedCorners: false,
    fullscreenable: true,
    width: 800,
    height: 500,
    x: targetDisplay.bounds.x + (targetDisplay.bounds.width - 800) / 2,
    y: targetDisplay.bounds.y + (targetDisplay.bounds.height - 500) / 2,
    kiosk: false,
    show: false,
    backgroundColor: "#000000",
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs"),
    },
  });

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
  }

  win.once("ready-to-show", () => {
    win?.show();
    smuConnection.start();
  });
}

function setKioskMode(enabled: boolean) {
  if (!win) return;

  if (enabled) {
    win.setKiosk(true);
    win.setResizable(true);
    win.maximize();
    win.setFullScreenable(true);
    win.setFullScreen(true);
    win.setResizable(false);
  } else {
    win.setSize(800, 500);
    win.setKiosk(false);
    win.setFullScreen(false);
    win.setResizable(false);
  }
}

function log(message: string) {
  console.log(`[SMU] ${message}`);
  try {
    win?.webContents.send("log-message", { message });
  } catch (e) {
    // Ignore send errors if window is destroyed
  }
}

// ===== SMU Connection Manager =====
class SMUConnectionManager {
  private socket: Socket<ServerToClientEvents, ClientToServerEvents> | null = null;
  private status: "connected" | "disconnected" = "disconnected";
  private reconnecting = false;
  private reconnectAttempts = 0;
  private maxReconnectDelay = 10000;
  private baseReconnectDelay = 2000;
  private isRunning = false;

  start() {
    if (this.isRunning) {
      log("Connection manager already running");
      return;
    }
    this.isRunning = true;
    log("Starting SMU connection manager...");
    this.connect();
  }

  stop() {
    this.isRunning = false;
    this.cleanup();
  }

  getStatus(): "connected" | "disconnected" {
    return this.status;
  }

  private async connect() {
    if (!this.isRunning) return;
    
    if (this.reconnecting) {
      log("Already attempting to reconnect, skipping...");
      return;
    }

    this.reconnecting = true;

    try {
      log(`Connection attempt ${this.reconnectAttempts + 1}...`);
      
      const socket = await resolveSMU();
      this.socket = socket;
      this.reconnectAttempts = 0;
      
      log("SMU connection established");
      this.setupSocketListeners();
      this.updateStatus("connected");
      setKioskMode(true);

      log("Requesting kiosk assets...");
      await this.socket.emit("kiosk:assets:request");

      // Send hello message
      try {
        this.socket.send(
          JSON.stringify({
            type: "HELLO",
            role: "KIOSK",
          })
        );
      } catch (e) {
        log("Failed to send HELLO message: " + e);
      }

      this.reconnecting = false;

    } catch (err) {
      this.reconnecting = false;
      this.reconnectAttempts++;
      
      const delay = Math.min(
        this.baseReconnectDelay * Math.pow(1.5, this.reconnectAttempts - 1),
        this.maxReconnectDelay
      );
      
      log(`Connection failed (attempt ${this.reconnectAttempts}). Retrying in ${delay}ms... Error: ${err}`);
      this.updateStatus("disconnected");
      
      if (this.isRunning) {
        setTimeout(() => this.connect(), delay);
      }
    }
  }

  private setupSocketListeners() {
    if (!this.socket) return;

    this.socket.removeAllListeners();

    this.socket.on("kiosk:assets:response", (data) => {
      log("Received kiosk assets info: " + JSON.stringify(data));
    });

    this.socket.on("disconnect", (reason) => {
      log(`SMU socket disconnected: ${reason}`);
      this.handleDisconnection();
    });


    this.socket.on("connect_error", (err) => {
      log(`SMU connection error: ${err}`);
      this.handleDisconnection();
    });
  }

  private handleDisconnection() {
    this.cleanup();
    this.updateStatus("disconnected");
    setKioskMode(false);

    if (this.isRunning) {
      setTimeout(() => this.connect(), 1000);
    }
  }

  private cleanup() {
    if (this.socket) {
      try {
        this.socket.removeAllListeners();
        this.socket.disconnect();
      } catch (e) {
        log("Error during socket cleanup: " + e);
      }
      this.socket = null;
    }
  }

  private updateStatus(status: "connected" | "disconnected") {
    this.status = status;
    log(`Status updated: ${status}`);
    
    try {
      win?.webContents.send("scu-status", { status });
    } catch (e) {
      // Ignore send errors
    }
  }
}

const smuConnection = new SMUConnectionManager();

// ===== App Lifecycle =====
app.on("window-all-closed", () => {
  smuConnection.stop();
  app.quit();
  win = null;
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.whenReady().then(async () => {
  createWindow();
});

// ===== IPC Handlers =====
ipcMain.on("scu-request-status", () => {
  const status = smuConnection.getStatus();
  try {
    win?.webContents.send("scu-status", { status });
  } catch (e) {
    // Ignore send errors
  }
});

ipcMain.handle("scu-get-status", async () => {
  return smuConnection.getStatus();
});
