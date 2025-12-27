
import dgram from 'dgram';
import express from "express";
import http from "http";
import { Server, Socket } from "socket.io";
import { ClientToServerEvents, ServerToClientEvents } from '../../../packages/socket-contracts/src/socket';
import network from './utils/network';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const SOCKET_PORT = 3000;
const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket: Socket<ClientToServerEvents, ServerToClientEvents>) => {
  console.log("New Socket.IO connection:", socket.id);

  socket.on("kiosk:register", (payload) => {
    console.log("Kiosk registered:", payload.kioskId);
    socket.join("kiosk:" + payload.kioskId);
    socket.emit("kiosk:register:ack", { accepted: true });
  });



  socket.on("kiosk:assets:manifest", () => {
    console.log("Kiosk assets request received");

    socket.emit("kiosk:assets:manifest:response", {
      assets: [
        { id: "Asset 1", url: "http://example.com/asset1", hash: "hash1" },
        { id: "Asset 2", url: "http://example.com/asset2", hash: "hash2" },
      ],
    });
  });

  socket.on("kiosk:products:request", () => {
    console.log("Kiosk products request received");

    socket.emit("kiosk:products:response", {
      products: [
        { id: "prod1", name: "Product 1", price: 9.99 },
        { id: "prod2", name: "Product 2", price: 19.99 },
      ],
    });
  });
  

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

httpServer.listen(SOCKET_PORT, () => {
  console.log(`SCU API + Socket.IO running on port ${SOCKET_PORT}`);
});




/**
 * SMU Discovery Broadcast
 */
const DISCOVERY_PORT = 41234;
const BROADCAST_INTERVAL = 2000;

const discoverySocket = dgram.createSocket("udp4");

/* ---- UDP setup ---- */

discoverySocket.bind(() => {
  discoverySocket.setBroadcast(true);
  console.log("Discovery socket ready");
});

setInterval(() => {
  const targets = network.getBroadcastTargets();

  const payload = Buffer.from(
    JSON.stringify({
      type: "SMU_ANNOUNCE",
      ip: network.privateIp(), //TODO: Remove and make kisok use source ip propably
      wsPort: SOCKET_PORT,
    })
  );

  for (const t of targets) {
    console.log(
      `Broadcast → ${t.interface} | ${t.address} → ${t.broadcast}`
    );

    discoverySocket.send(
      payload,
      0,
      payload.length,
      DISCOVERY_PORT,
      t.broadcast
    );
  }
}, BROADCAST_INTERVAL);
