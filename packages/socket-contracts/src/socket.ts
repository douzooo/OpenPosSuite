import { KioskRegisterPayload } from "./types";
import { SOCKET_EVENTS } from './events';

export interface ClientToServerEvents {
  KIOSK_REGISTER: (payload: KioskRegisterPayload) => void;
  "kiosk:assets:request": () => void;
}

export interface ServerToClientEvents {
  "kiosk:register:ack": (payload: {accepted: boolean}) => void;
  "kiosk:assets:response": (payload: {assets: {name: string, url: string}[]}) => void;
}
