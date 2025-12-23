import { useEffect, useState } from "react";
import { useInactivity } from "../hooks/useInactivity";
import { useScreen } from "../state/useScreen";
import { useOrder } from "../hooks/useOrder";

const MenuScreen = () => {
  const { isInactive, resetTimer } = useInactivity(1000 * 5);

  const [testClickableState, setTestClickable] = useState<number>(0);

  const { goTo } = useScreen();

  const {order, addProduct} = useOrder();

  useEffect(() => {
    if (isInactive) {
      console.log("User inactive, redirecting to start screen");
      goTo("STILL_THERE");
      resetTimer();
    }
    return () => {
      console.log("MenuScreen unmounted");
    };
  }, [isInactive, goTo, resetTimer]);

  return (
    <div className="absolute w-full h-full flex flex-col">
      <div className="flex-1">
        <img src="" alt="" className="w-full h-full object-cover" />
      </div>
      <div
        onClick={() => {
          setTestClickable(testClickableState + 1);
        }}
      >
        {testClickableState}
      </div>
      <div className="h-full max-h-[400px] flex justify-center">
        <button onClick={() => addProduct({ name: "Cheeseburger", id: "cheeseburger", price: 5.99 , quantity: 1})}>Add Cheeseburger</button>
        <div className="h-full bg-teal-600 w-full">{order.map((item) => (<div key={item.name}>{item.name} x{item.quantity}</div>))}</div>
      </div>
    </div>
  );
};
export default MenuScreen;
