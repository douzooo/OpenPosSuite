export interface Kiosk {
  setupState: KioskSetupState;
  state: KioskState;
  tempId?: string;
  kioskId?: string;
}

export interface ServerKiosk extends Kiosk {
  lastSeen: number;
  terminal_id?: string;
}


export type KioskState = "ONLINE" | "OFFLINE";
export type KioskSetupState = "UNKNOWN" | "PENDING" | "REGISTERED";

export interface KioskRegisterPayload {
  kioskId: string;
  version: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  label: Label | null;
}

export interface Label {
  key: string;
}
