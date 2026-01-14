import { useEffect } from "react";
import LoadingScene from "./screen/LoadingScene";
import { useScreen } from "./state/useScreen";
import StartScreen from "./screen/StartScreen";
import MenuScreen from "./screen/MenuScreen";
import StillThereScreen from "./screen/StillThereScreen";
import { useInactivity } from "./hooks/InactivityContext";
import AddProductScreen from "./screen/AddProductScreen";
import { Screen } from "./state/screens";
import ErrorScreen from "./screen/ErrorScreen";
import { Kiosk, KioskSetupState, KioskState } from "@openpos/socket-contracts";
import SetupKioskScreen from "./screen/SetupKioskScreen";
import OrderReviewScreen from "./screen/OrderReviewScreen";

export default function App() {
  const { screen, goTo } = useScreen();
  const { isInactive, resetTimer } = useInactivity();

  console.log("Current screen:", screen);

  useEffect(() => {
    const unsub = (window as any).kiosk.onStateChange((kiosk: KioskState) => {
      goTo({ name: "ERROR", message: "Kiosk state changed: " + kiosk });
    });

    return () => {
      if (typeof unsub === "function") unsub();
    };
  }, [goTo]);

  useEffect(() => {
    if (isInactive && (screen.name === "BOOT" || screen.name === "START" || screen.name === "ERROR" || screen.name === "SETUP_KIOSK")) {
      //TODO: Maybe have a list of screens that should not have inactivity
      resetTimer();
      return;
    }
    return () => {
      console.log("App unmounted");
    };
  }, [isInactive, goTo, resetTimer, screen]);



  useEffect(() => {
    const unsub = (window as any).screenManager.onShowScreen((screen: Screen) => {
      goTo(screen);
    });

    return () => {
      if (typeof unsub === "function") unsub();
    };
  }, [goTo]);

  let screenToShow = null;


  switch (screen.name) {
    case "BOOT":
      screenToShow = <LoadingScene />;
      break;
    case "START":
      screenToShow = <StartScreen />;
      break;
    case "MENU":
      screenToShow = <MenuScreen />;
      break;
    case "SELECT_PRODUCT":
      screenToShow = <AddProductScreen product={screen.product} />;
      break;
    case "ERROR":
      screenToShow = <ErrorScreen message={screen.message} />;
      break;
    case "SETUP_KIOSK":
      screenToShow = <SetupKioskScreen deviceId={screen.deviceId} />;
      break;
    case "ORDER_REVIEW":
      screenToShow = <OrderReviewScreen />;
      break;
    default:
      return <ErrorScreen message={`Unknown screen: ${screen.name}`} />;
  }

  return (
    <>
      {screenToShow}
      {isInactive && !(screen.name === "BOOT" || screen.name === "START" || screen.name === "ERROR" || screen.name === "SETUP_KIOSK") && (
        <StillThereScreen />
      )}
    </>
  );
}
