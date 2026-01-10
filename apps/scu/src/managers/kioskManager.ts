import { Kiosk, ServerKiosk } from "../../../../packages/socket-contracts/src/types";

class KioskManager {
    #kiosks = new Map<string, ServerKiosk>();
    #pending = new Map<string, ServerKiosk>();

    registerUnknown(kioskInfo: Partial<Kiosk>): ServerKiosk {
        const deviceId = crypto.randomUUID();

        const kiosk : ServerKiosk = {
            ...kioskInfo,
            setupState: "PENDING",
            lastSeen: Date.now(),
            deviceId
        } as ServerKiosk;

        this.#pending.set(deviceId, kiosk);
        return kiosk;
    }

    setup(deviceId: string, kioskId: string, poiid: string): ServerKiosk {
        const kiosk = this.#pending.get(deviceId);
        if (!kiosk) {
            throw new Error("Kiosk with deviceId " + deviceId + " not found in pending kiosks");
        }

        kiosk.kioskId = kioskId;
        kiosk.terminal_id = poiid;
        kiosk.setupState = "REGISTERED";
        kiosk.lastSeen = Date.now();
        
        this.#pending.delete(deviceId);
        this.#kiosks.set(deviceId, kiosk);

        return kiosk;
    }

    heartbeat(deviceId: string): void {
        const kiosk = this.#kiosks.get(deviceId);
        if (kiosk) {
            kiosk.lastSeen = Date.now();
        }
    }

    getByDeviceId(deviceId: string): ServerKiosk | undefined {
        return this.#kiosks.get(deviceId);
    }

    getPendingByDeviceId(deviceId: string): ServerKiosk | undefined {
        return this.#pending.get(deviceId);
    }

}

export const kioskManager = new KioskManager();