import { useEffect, useState } from "react";
import { useInactivity } from "../hooks/useInactivity";
import { useScreen } from "../state/useScreen";
import { useOrder } from "../hooks/useOrder";
import { useProducts } from "../hooks/useProducts";
import Product from "../components/products/Product";

const MenuScreen = () => {
  const [testClickableState, setTestClickable] = useState<number>(0);

  const { order, addProduct, clearOrder } = useOrder();
  const { goTo } = useScreen();
  const products = useProducts();

  return (
    <div className="absolute w-full h-full flex flex-col">
      <div className="flex flex-1">
        <div className="sidebar flex w-[240px] border-r"></div>
        <div className="flex-1">
          <h1 className="text-3xl font-bold p-4">Products</h1>
          <div className="grid grid-cols-3 gap-4">
            {products.map((product) => (
              <Product key={product.id} {...product} />
            ))}
          </div>
        </div>
      </div>
      <div className="flex h-[280px] w-full items-center justify-around border-t">
        <button
          className="bg-red-700 h-16 w-64 rounded-md text-white text-xl"
          onClick={() => {
            clearOrder();
            goTo("START");
          }}
        >
          Cancel Order
        </button>
      </div>
    </div>
  );
};
export default MenuScreen;
