import { io, Socket } from "socket.io-client";
import dgram from "dgram";
import { ClientToServerEvents, ServerToClientEvents } from "@openpos/socket-contracts";
const LOCAL_URL = "http://127.0.0.1:3000";
const UDP_PORT = 41234;

export async function resolveSMU(): Promise<Socket<ServerToClientEvents, ClientToServerEvents>> {
  try {
    console.log("Trying SMU on localhost...");
    const socket = await trySocketIO(LOCAL_URL, 1500);
    console.log("Connected to local SMU");
    return socket;
  } catch {
    console.log("No local SMU found, starting UDP discovery...");
  }

  return discoverViaUDP();
}

function trySocketIO(url: string, timeout: number): Promise<Socket<ServerToClientEvents, ClientToServerEvents>> {
  return new Promise((resolve, reject) => {
    const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(url, {
      transports: ["websocket"],
      timeout,
      reconnection: false,
    });

    

    const timer = setTimeout(() => {
      socket.disconnect();
      reject(new Error("Socket.IO timeout"));
    }, timeout);

    socket.on("connect", () => {
      clearTimeout(timer);
      resolve(socket);
    });

    socket.on("connect_error", (err) => {
      clearTimeout(timer);
      socket.disconnect();
      reject(err);
    });
  });
}

function discoverViaUDP(): Promise<Socket> {
  return new Promise((resolve) => {
    const udp = dgram.createSocket("udp4");

    udp.on("message", async (msg) => {
      try {
        const data = JSON.parse(msg.toString());

        if (data.type === "SMU_ANNOUNCE") {
          console.log("SMU announced:", data);

          const socket = await trySocketIO(
            `http://${data.ip}:${data.wsPort}`,
            3000
          );

          udp.close();
          resolve(socket);
        }
      } catch {
        // ignore malformed packets
      }
    });

    udp.bind(UDP_PORT, () => {
      console.log("Listening for SMU UDP broadcasts...");
    });
  });
}
