import { KioskRegisterPayload, Product } from "./types.js";
import { SOCKET_EVENTS } from './events.js';

export interface ClientToServerEvents {
  KIOSK_REGISTER: (payload: KioskRegisterPayload) => void;
  "kiosk:assets:request": () => void;
  "kiosk:products:request": () => void;
}

export interface ServerToClientEvents {
  "kiosk:register:ack": (payload: {accepted: boolean}) => void;
  "kiosk:assets:response": (payload: {assets: {name: string, url: string}[]}) => void;
  "kiosk:products:response": (payload: {products: Product[]}) => void;
}

