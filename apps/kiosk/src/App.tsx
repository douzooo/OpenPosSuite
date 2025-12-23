import { useEffect } from "react";
import LoadingScene from "./screen/LoadingScene";
import { useScreen } from "./state/useScreen";
import StartScreen from "./screen/StartScreen";
import MenuScreen from "./screen/MenuScreen";
import StillThereScreen from "./screen/StillThereScreen";

export default function App() {
  const { screen, goTo } = useScreen();

  useEffect(() => {
    const unsub = (window as any).scu.onStatus((status: string) => {
      console.log("Hellooo", status);
      if (status === "connected") {
        goTo("START");
      }else if(status == "disconnected"){
        goTo("BOOT")
      }
    });

    try {
      (window as any).scu.requestStatus?.();
    } catch {}

    return () => {
      if (typeof unsub === "function") unsub();
    };
  }, [goTo]);

  switch (screen) {
    case "BOOT":
      return <LoadingScene />;
    case "START":
      return <StartScreen />;
    case "MENU":
      return <MenuScreen />;
    case "STILL_THERE":
      return <StillThereScreen/>
    default:
      return null;
  }
}
