import { app, BrowserWindow, ipcMain, screen } from "electron";
import { fileURLToPath } from "node:url";
import path from "node:path";

import WebSocket from "ws";
import { resolveSMU } from "./smuResolver";

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
  // Find the first vertical screen (portrait orientation)
  const displays = screen.getAllDisplays();
  let targetDisplay = displays[0]; // fallback to primary display

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

  win.setAlwaysOnTop(true, "screen-saver");

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
  }

  // 👇 show ONLY when renderer is ready
  win.once("ready-to-show", () => {
    win?.show();
    startSMULoop();
  });
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  app.quit();
  win = null;
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

let smuSocket: WebSocket | null = null;
let scuStatus: "connected" | "disconnected" = "disconnected";

function sendStatus(status: "connected" | "disconnected") {
  scuStatus = status;
  try {
    win?.webContents.send("scu-status", { status });
  } catch (e) {
    // ignore send errors
  }
}

function sendLog(message: string) {
  try {
    win?.webContents.send("log-message", { message });
  } catch (e) {
    // ignore send errors
  }
}

function log(message: string) {
  console.log(message);
  sendLog(message);
}

async function startSMULoop() {
  log("Starting SMU connection loop...");
  setTimeout(async () => {
    while (true) {
      try {
        const ws = await resolveSMU();
        smuSocket = ws;
        log("SMU connection established");

        sendStatus("connected");
        win?.setKiosk(true);
        win?.setResizable(true);
        //TODO: Change back to kiosk mode when publishing
        win?.maximize();
        win?.setFullScreenable(true);
        win?.setFullScreen(true);
        win?.setResizable(false);

        try {
          smuSocket.send(
            JSON.stringify({
              type: "HELLO",
              role: "KIOSK",
            })
          );
        } catch {}

        smuSocket.on("close", () => {
          console.log("SMU socket closed");
          smuSocket = null;
          sendStatus("disconnected");
          win?.setSize(800, 500);
          win?.setKiosk(false);
          win?.setFullScreen(false);
          win?.setResizable(false);
          win?.setPosition({
            x:
              targetDisplay.bounds.x +
              (targetDisplay.bounds.width - 800) / 2,
            y:
              targetDisplay.bounds.y +
              (targetDisplay.bounds.height - 500) / 2,
          })
        });

        smuSocket.on("error", (err) => {
          console.error("SMU socket error", err);
          // error will usually be followed by close
        });

        // Wait until socket closes before attempting reconnect
        await new Promise<void>((resolve) => {
          if (!smuSocket) return resolve();
          smuSocket.on("close", () => resolve());
        });
      } catch (err) {
        console.log("Failed to connect to SMU, retrying in 2s", err);
        sendStatus("disconnected");
        await new Promise((r) => setTimeout(r, 2000));
      }
      // small delay before next attempt
      await new Promise((r) => setTimeout(r, 1000));
    }
  }, 1000);
}

app.whenReady().then(async () => {
  createWindow();
});

// Renderer can request immediate status
ipcMain.on("scu-request-status", () => {
  sendStatus(scuStatus);
});

ipcMain.handle("scu-get-status", async () => {
  return scuStatus;
});
