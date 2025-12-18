import dgram from 'dgram';
import system from './utils/system';
import WebSocket, { WebSocketServer } from 'ws';

const WEBSOCKET_PORT = 4242;

const wss = new WebSocketServer({
  port: WEBSOCKET_PORT,
  perMessageDeflate: {
    zlibDeflateOptions: {
      chunkSize: 1024,
      memLevel: 7,
      level: 3
    },
    zlibInflateOptions: {
      chunkSize: 10 * 1024
    },
    clientNoContextTakeover: true,
    serverNoContextTakeover: true,
    serverMaxWindowBits: 10,
    concurrencyLimit: 10,
    threshold: 1024
  }
});

wss.on('connection', (ws: WebSocket) => {
  console.log('New WebSocket connection established');

  ws.on('message', (message: string) => {
    console.log(`Received message: ${message}`);
    // Hier können Sie Nachrichten verarbeiten
  });

  ws.on('close', () => {
    console.log('WebSocket connection closed');
  });
});

const server = dgram.createSocket('udp4');


/**
 * SMU Discovery Broadcast
 */
const BROADCAST_INTERVAL = 2000;
const DISCOVERY_PORT = 41234;

server.bind(() => {
  server.setBroadcast(true);
});

console.log(`${system.privateIp()}`);

setInterval(() => {
  const message = Buffer.from(JSON.stringify({
    type: 'SMU_ANNOUNCE',
    ip: system.privateIp(),
    wsPort: WEBSOCKET_PORT
  }));
  console.log("Broadcasting SMU_ANNOUNCE");
  server.send(message, 0, message.length, DISCOVERY_PORT, '255.255.255.255');
}, BROADCAST_INTERVAL);
