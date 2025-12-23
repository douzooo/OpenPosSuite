import { useEffect } from "react";
import { useInactivity } from "../hooks/useInactivity";
import { useScreen } from "../state/useScreen";
import { useOrder } from "../hooks/useOrder";

const StillThereScreen = () => {
  const { isInactive, resetTimer } = useInactivity(1000 * 20);
  const { goTo } = useScreen();
const { clearOrder } = useOrder();

  useEffect(() => {
    if (isInactive) {
      goTo("START");
      clearOrder();
      resetTimer();
    }
    return () => {};
  }, [isInactive]);

  return (
    <div>
      <h1>Are you still there?</h1>
      <button
        onClick={() => {
          goTo("START");
        }}
      >
        Cancel Order
      </button>
      <button
        onClick={() => {
          goTo("MENU");
        }}
      >
        Yes, I'm here
      </button>
    </div>
  );
};

export default StillThereScreen;
