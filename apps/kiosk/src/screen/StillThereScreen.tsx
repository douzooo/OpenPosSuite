import { useEffect, useState } from "react";
import { useInactivity } from "../hooks/InactivityContext";
import { useScreen } from "../state/useScreen";
import { useOrder } from "../hooks/useOrder";

const STILL_THERE_TIMEOUT = 10; //reminder>: this are seconds

const StillThereScreen = () => {
  const { resetTimer } = useInactivity();
  const { goTo } = useScreen();
  const { clearOrder } = useOrder();
  const [, setSecondsLeft] = useState(STILL_THERE_TIMEOUT);

  useEffect(() => {
    setSecondsLeft(STILL_THERE_TIMEOUT);
    const interval = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(interval);
          goTo("START");
          clearOrder();
          resetTimer();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [goTo, clearOrder, resetTimer]);

  return (
    <div className="absolute w-full h-full items-center justify-center flex bg-gray-800/40">
      <div className="flex rounded p-6 bg-white">
        <h1>Are you still there?</h1>
        <button
          onClick={() => {
            goTo("START");
            clearOrder();
            resetTimer();
          }}
        >
          Cancel Order
        </button>
        <button
          onClick={() => {
            resetTimer();
          }}
        >
          Yes, I'm here
        </button>
      </div>
    </div>
  );
};

export default StillThereScreen;
