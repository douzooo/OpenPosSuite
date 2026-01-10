import { Kiosk, ServerKiosk } from "../../../../packages/socket-contracts/src/types";

class KioskManager {
    #kiosks = new Map<string, ServerKiosk>();
    #pending = new Map<string, ServerKiosk>();



    registerUnknown(kioskInfo: Partial<Kiosk>): ServerKiosk {
        const tempId = crypto.randomUUID();

        const kiosk : ServerKiosk = {
            ...kioskInfo,
            setupState: "PENDING",
            lastSeen: Date.now(),
            tempId
        } as ServerKiosk;

        this.#pending.set(tempId, kiosk);
        return kiosk;
    }

    setup(tempId: string, kioskId: string, poiid: string): ServerKiosk {
        const kiosk = this.#pending.get(tempId);
        if (!kiosk) {
            throw new Error("Kiosk with tempId " + tempId + " not found in pending kiosks");
        }

        kiosk.kioskId = kioskId;
        kiosk.terminal_id = poiid;
        kiosk.setupState = "REGISTERED";
        kiosk.lastSeen = Date.now();
        
        this.#pending.delete(tempId);
        this.#kiosks.set(kioskId, kiosk);

        return kiosk;
    }

    heartbeat(kioskId: string): void {
        const kiosk = this.#kiosks.get(kioskId);
        if (kiosk) {
            kiosk.lastSeen = Date.now();
        }
    }

    getByKioskId(kioskId: string): ServerKiosk | undefined {
        return this.#kiosks.get(kioskId);
    }

}

export const kioskManager = new KioskManager();