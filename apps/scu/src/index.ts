import dgram from "dgram";
import express from "express";
import http from "http";
import { Server, Socket } from "socket.io";
import {
  ClientToServerEvents,
  ServerToClientEvents,
} from "../../../packages/socket-contracts/src/socket";
import network from "./utils/network";
import { Client, Config, EnvironmentEnum, RegionEnum, TerminalCloudAPI } from "@adyen/api-library";
import { SaleToPOIRequest } from "@adyen/api-library/lib/src/typings/terminal/saleToPOIRequest";
import { MessageClassType } from "@adyen/api-library/lib/src/typings/terminal/messageClassType";
import { MessageCategoryType } from "@adyen/api-library/lib/src/typings/terminal/messageCategoryType";
import { MessageType } from "@adyen/api-library/lib/src/typings/terminal/models";

import { kioskManager } from "./managers/kioskManager";

const config = new Config({
  apiKey: "YOUR_API_KEY",
  environment: EnvironmentEnum.TEST,
  region: RegionEnum.EU
});

const client = new Client(config);
client.config.terminalApiCloudEndpoint = "https://localhost:8443";
const terminalCloudAPI = new TerminalCloudAPI(client);

const serviceID = "123456789";
const saleID = "POS-SystemID12345";
const POIID = "default";

const transactionID = "TransactionID";
const paymentRequest: SaleToPOIRequest = {
  MessageHeader: {
    MessageClass: MessageClassType.Service,
    MessageCategory: MessageCategoryType.Payment,
    MessageType: MessageType.Request,
    ProtocolVersion: "3.0",
    ServiceID: serviceID,
    SaleID: saleID,
    POIID: POIID
  },
  PaymentRequest: {
    SaleData: {
      SaleTransactionID: {
        TransactionID: transactionID,
        TimeStamp: new Date().toISOString()
      },

      SaleToAcquirerData: {
        applicationInfo: {
          merchantApplication: {
            version: "1",
            name: "test",
          }
        }
      }
    },
    PaymentTransaction: {
      AmountsReq: {
        Currency: "EUR",
        RequestedAmount: 1000
      }
    }
  }
};

terminalCloudAPI.sync({ SaleToPOIRequest: paymentRequest }).catch((error) => {
  console.error("Error making payment request:", error);
}).finally(() => {
  console.log("Payment request process completed.");
});



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

io.on(
  "connection",
  (socket: Socket<ClientToServerEvents, ServerToClientEvents>) => {
    console.log("New Socket.IO connection:", socket.id);

    socket.on("kiosk:whoami", () => {
      console.log("Kiosk whoami request received");

      if (kioskManager.getByKioskId(socket.id)) {
        socket.emit("kiosk:whoami:response", kioskManager.getByKioskId(socket.id)!!);
      }else{
        const unknownKiosk = kioskManager.registerUnknown({});
        socket.emit("kiosk:whoami:response", unknownKiosk);
      }
    });

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
          {
            id: "prod1", name: "Cheeseburger", price: 5.99,
            label: { key: "label.popular" }
          },
          { id: "prod2", name: "Chickenburger", price: 4.99, label: null },
          { id: "prod2", name: "BigFatty", price: 1900.99, label: null },
          { id: "prod2", name: "SmallFatty", price: 1900.99, label: null },
          { id: "prod2", name: "Chickenburger", price: 1900.99, label: null },
          { id: "prod2", name: "Chickenburger", price: 1900.99, label: null },
          { id: "prod2", name: "Chickenburger", price: 1900.99, label: null },
          { id: "prod2", name: "Chickenburger", price: 1900.99, label: null },
          { id: "prod2", name: "Chickenburger", price: 1900.99, label: null },
          { id: "prod2", name: "Chickenburger", price: 1900.99, label: null },
          { id: "prod2", name: "Chickenburger", price: 1900.99, label: null },
          { id: "prod2", name: "Chickenburger", price: 1900.99, label: null },
          { id: "prod2", name: "Chickenburger", price: 1900.99, label: null },
          { id: "prod2", name: "Chickenburger", price: 1900.99, label: null },
          { id: "prod2", name: "Chickenburger", price: 1900.99, label: { "key": "label.new" } },
          { id: "prod2", name: "Free Burger at the bottom lol", price: 0, label: null },

        ],
      });
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  }
);

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
    console.log(`Broadcast → ${t.interface} | ${t.address} → ${t.broadcast}`);

    discoverySocket.send(
      payload,
      0,
      payload.length,
      DISCOVERY_PORT,
      t.broadcast
    );
  }
}, BROADCAST_INTERVAL);
