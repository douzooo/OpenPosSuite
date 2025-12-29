import { useEffect, useState } from "react";
import { useInactivity } from "../hooks/useInactivity";
import { useScreen } from "../state/useScreen";
import { useOrder } from "../hooks/useOrder";
import { useProducts } from "../hooks/useProducts";
import Product from "../components/products/Product";
import Scrollbars from "react-custom-scrollbars-2";

const MenuScreen = () => {
  const { clearOrder } = useOrder();
  const { goTo } = useScreen();
  const products = useProducts();

  return (
    <div className="absolute w-full h-full flex flex-col">
      <div className="flex flex-1 overflow-hidden">
        <div className="sidebar flex w-[240px] border-r"></div>
        <div className="flex flex-col flex-1 p-8 pb-0">
          <h1 className="text-3xl font-bold p-4">Products</h1>{" "}
          <div className="flex-1 overflow-hidden relative">
            <Scrollbars
              autoHide={false}
              thumbSize={150}
              renderTrackVertical={({ style, ...props }) => (
                <div
                  {...props}
                  style={{
                    ...style,
                    width: 20,
                    height: "900px",
                    right: 20,
                    top: 0,
                    bottom: 0,
                    borderRadius: 20,
                    backgroundColor: "#e5e5e5",
                  }}
                />
              )}
              renderThumbVertical={({ style, ...props }) => (
                <div
                  {...props}
                  style={{
                    ...style,
                    width: 40,
                    right: 10,
                    borderRadius: 20,
                    backgroundColor: "#c8c8c8",
                    cursor: "grab",
                  }}
                />
              )}
            >
              <div className="grid grid-cols-3 gap-4 pl-2 pr-16 pb-8">
                {products.map((product) => (
                  <Product key={product.id} {...product} />
                ))}
              </div>
            </Scrollbars>
          </div>
        </div>
      </div>
      <div className="flex min-h-[280px] h-[280px] w-full items-center justify-around border-t">
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
