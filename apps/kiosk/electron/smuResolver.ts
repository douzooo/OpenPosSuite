import WebSocket from 'ws';
import dgram from 'dgram';

const LOCAL_WS = 'ws://127.0.0.1:4242';
const UDP_PORT = 41234;

export async function resolveSMU(): Promise<WebSocket> {
  try {
    console.log('Trying SMU on localhost...');
    const ws = await tryWs(LOCAL_WS, 1500);
    console.log('Connected to local SMU');
    return ws;
  } catch {
    console.log('No local SMU found, starting UDP discovery...');
  }

  return discoverViaUDP();
}

function tryWs(url: string, timeout: number): Promise<WebSocket> {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(url);
    const timer = setTimeout(() => {
      ws.terminate();
      reject(new Error('WS timeout'));
    }, timeout);

    ws.on('open', () => {
      clearTimeout(timer);
      resolve(ws);
    });

    ws.on('error', (err) => {
      clearTimeout(timer);
      reject(err);
    });
  });
}

function discoverViaUDP(): Promise<WebSocket> {
  return new Promise((resolve) => {
    const socket = dgram.createSocket('udp4');

    socket.on('message', async (msg) => {
      try {
        const data = JSON.parse(msg.toString());

        if (data.type === 'SMU_ANNOUNCE') {
          console.log('SMU announced:', data.ip);

          const ws = await tryWs(`ws://${data.ip}:${data.wsPort}`, 3000);
          socket.close();
          resolve(ws);
        }
      } catch {
        //ignore now
      }
    });

    socket.bind(UDP_PORT, () => {
      console.log('Listening for SCU UDP broadcasts...');
    });
  });
}
