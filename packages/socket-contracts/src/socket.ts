import { KioskRegisterPayload, Product } from "./types.js";
import { SOCKET_EVENTS } from './events.js';

export interface ClientToServerEvents {
  "kiosk:register": (payload: KioskRegisterPayload) => void;
  "kiosk:assets:manifest": () => void;
  "kiosk:products:request": () => void;
}

export interface ServerToClientEvents {
  "kiosk:register:ack": (payload: {accepted: boolean}) => void;
  "kiosk:assets:manifest:response": (payload: {assets: {id: string, url: string, hash: string}[]}) => void;
  "kiosk:products:response": (payload: {products: Product[]}) => void;
}

