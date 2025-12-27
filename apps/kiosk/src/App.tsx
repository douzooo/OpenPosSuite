import { useEffect } from "react";
import LoadingScene from "./screen/LoadingScene";
import { useScreen } from "./state/useScreen";
import StartScreen from "./screen/StartScreen";
import MenuScreen from "./screen/MenuScreen";
import StillThereScreen from "./screen/StillThereScreen";
import { useInactivity } from "./hooks/InactivityContext";

export default function App() {
  const { screen, goTo } = useScreen();
  const { isInactive, resetTimer } = useInactivity();

  useEffect(() => {
    if (isInactive && (screen === "BOOT" || screen === "START")) {
      //TODO: Maybe have a list of screens that should not have inactivity
      resetTimer();
      return;
    }
    return () => {
      console.log("App unmounted");
    };
  }, [isInactive, goTo, resetTimer, screen]);

  useEffect(() => {
    const unsub = (window as any).scu.onStatus((status: string) => {
      console.log("Hellooo", status);
      if (status === "connected") {
        goTo("START");
      } else if (status == "disconnected") {
        goTo("BOOT");
      }
    });

    try {
      (window as any).scu.requestStatus?.();
    } catch {}

    return () => {
      if (typeof unsub === "function") unsub();
    };
  }, [goTo]);

  let screenToShow = null;

  switch (screen) {
    case "BOOT":
      screenToShow = <LoadingScene />;
      break;
    case "START":
      screenToShow = <StartScreen />;
      break;
    case "MENU":
      screenToShow = <MenuScreen />;
      break;
    default:
      return null;
  }

  return (
    <>
      {screenToShow}
      {(isInactive && !(screen === "BOOT" || screen === "START")) && <StillThereScreen />}
    </>
  );
}
