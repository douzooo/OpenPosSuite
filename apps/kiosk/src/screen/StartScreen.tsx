import { useEffect, useState } from "react";
import { useScreen } from "../state/useScreen";

import foodReady from "./../assets/food-ready.png";
import foodToGo from "./../assets/food-togo.png";

const StartScreen = () => {
  const { goTo } = useScreen();

  const [time, setTime] = useState<string>(() =>
    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  );

  useEffect(() => {
    //For updating the time as good as possible
    const now = new Date();
    const msTillNextMin =
      (60 - now.getSeconds()) * 1000 - now.getMilliseconds();
    const timeout = setTimeout(() => {
      setTime(
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
      const interval = setInterval(() => {
        setTime(
          new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
        );
      }, 60000);

      return () => clearInterval(interval);
    }, msTillNextMin);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="absolute w-full h-full flex flex-col bg-white items-center">
      <div className="flex w-full justify-between p-8 text-md font-medium">
        <span>{time.toLowerCase()}</span>
        <span>DE</span>
      </div>
      <div className="flex flex-col items-center gap-26">
        <h1 className="text-5xl font-bold">"Wo willst du heute essen?"</h1>
        <div className="flex gap-2 relative">
          <button
            className="rounded-2xl bg-white w-[365px] h-[500px] font-extrabold cursor-pointer border border-gray-300 text-3xl justify-center flex items-center flex-col"
            onClick={async () => {
              goTo("MENU");
            }}
          >
            <img src={foodToGo} alt="Mitnehmen" className="w-55" />
            <p className="absolute bottom-10">Mitnehmen</p>
          </button>
          <button
            className="rounded-2xl bg-red-700 w-[365px] h-[500px] text-white font-bold cursor-pointer border border-gray-300"
            onClick={async () => {
              goTo("MENU");
            }}
          >
            <img src={foodReady} alt="Hier essen" className="w-60" />
            Hier essen
          </button>
        </div>
      </div>
    </div>
  );
};
export default StartScreen;
