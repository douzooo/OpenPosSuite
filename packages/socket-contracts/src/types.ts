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
