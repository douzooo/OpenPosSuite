export interface Kiosk extends KioskConfig{
  setupState: KioskSetupState;
  state: KioskState;
}

export interface ServerKiosk extends Kiosk {
  lastSeen: number;
  terminal_id?: string;
}

export interface KioskConfig{
  deviceId?: string;
  kioskId?: string;
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

export interface Order{
  items: OrderItem[],
  data: Map<String, Object>
}

export interface OrderItem {
	id: string;
	name: string;
	price: number;
	quantity: number;
}