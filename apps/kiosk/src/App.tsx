import { useEffect } from "react";
import LoadingScene from "./screen/LoadingScene";
import HomeScreen from "./screen/HomeScene";
import { useScreen } from "./state/useScreen";

export default function App() {
  const { screen, goTo } = useScreen();

  useEffect(() => {
    const unsub = (window as any).scu.onStatus((status: string) => {
      console.log("Hellooo", status);
      if (status === "connected") {
        goTo("MENU");
      }else if(status == "disconnected"){
        goTo("BOOT")
      }
    });

    // Ask main for current status in case it connected before renderer loaded
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
    case "MENU":
      return <HomeScreen />;
    default:
      return null;
  }
}
