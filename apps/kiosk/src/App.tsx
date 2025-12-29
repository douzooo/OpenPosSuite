import { useEffect } from "react";
import LoadingScene from "./screen/LoadingScene";
import { useScreen } from "./state/useScreen";
import StartScreen from "./screen/StartScreen";
import MenuScreen from "./screen/MenuScreen";
import StillThereScreen from "./screen/StillThereScreen";
import { useInactivity } from "./hooks/InactivityContext";
import AddProductScreen from "./screen/AddProductScreen";

export default function App() {
  const { screen, goTo } = useScreen();
  const { isInactive, resetTimer } = useInactivity();

  useEffect(() => {
    if (isInactive && (screen.name === "BOOT" || screen.name === "START")) {
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
        goTo({ name: "START" });
      } else if (status == "disconnected") {
        goTo({ name: "BOOT" });
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
    default:
      return (<div className="m-4 p-4 border-4 border-red-400 bg-red-600">
        <h1 className="text-white text-4xl font-extrabold">Error</h1>
        <p className="text-white my-4 rounded-md">Unknown screen: {JSON.stringify(screen)}</p>
        <p className="text-white uppercase font-extrabold">Please contact a staff member</p>
      </div>);
  }

  return (
    <>
      {screenToShow}
      {isInactive && !(screen.name === "BOOT" || screen.name === "START") && (
        <StillThereScreen />
      )}
    </>
  );
}
