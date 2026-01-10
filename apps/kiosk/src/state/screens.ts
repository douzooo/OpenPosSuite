import { Product } from "@openpos/socket-contracts";

export type Screen =
  | {name: 'BOOT'}
  | {name: 'START'}
  | {name: 'MENU'}
  | {name: 'SELECT_PRODUCT', product: Product}
  | {name: 'CART'}
  | {name: 'PAYMENT'}
  | {name: 'PROCESSING'}
  | {name: 'SUCCESS'}
  | {name: 'STILL_THERE'}
  | {name: 'ERROR', message?: string}
  | {name: 'SETUP_KIOSK', deviceId: string};
