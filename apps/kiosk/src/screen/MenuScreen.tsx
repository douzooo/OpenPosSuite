import { useEffect, useMemo, useState } from "react";
import { useInactivity } from "../hooks/useInactivity";
import { useScreen } from "../state/useScreen";
import { useOrder } from "../hooks/useOrder";
import { useProducts } from "../hooks/useProducts";
import Product from "../components/products/Product";
import Scrollbars from "react-custom-scrollbars-2";

const MenuScreen = () => {
  const { clearOrder, order } = useOrder();
  const { goTo } = useScreen();
  let products = useProducts();

  products = products.sort((a, b) => (b.label?.key || "").localeCompare(a.label?.key || ""));

  const [activeFilter, setActiveFilter] = useState<string>("All");
  const filteredProducts = useMemo(() => {
    if (activeFilter === "All") return products;
    if (activeFilter === "Popular") {
      return products.filter((p) => p.label?.key === "label.popular");
    }
    if (activeFilter === "New") {
      return products.filter((p) => p.label?.key === "label.new");
    }
    return products;
  }, [products, activeFilter]);

  {/** Calculate total items in the order, however could I make this better? */ }
  const [productInCarts, setProductInCarts] = useState<number>(0);
  useEffect(() => {
    let totalItems = 0;
    order.forEach((item) => {
      totalItems += item.quantity;
    });
    setProductInCarts(totalItems);
  }, [order]);

  return (
    <div className="absolute w-full h-full flex flex-col">
      <div className="flex flex-1 overflow-hidden">
        <div className="sidebar flex w-[240px]">
          <div className="p-4 text-2xl font-bold">Menu</div>
        </div>
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
                    borderRadius: 20,
                    backgroundColor: "#e5e5e5",
                    zIndex: 100,
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

              <div className="sticky top-0 z-10 bg-linear-to-t from-white/80 to-white backdrop-blur p-4 flex gap-2 h-20 drop-shadow-2xl">
                {[
                  { key: "All" },
                  { key: "Popular" },
                  { key: "New" },
                ].map((c) => (
                  <button
                    key={c.key}
                    onClick={() => setActiveFilter(c.key)}
                    className={`px-4 py-2 rounded-full text-sm border ${activeFilter === c.key
                        ? "bg-gray-800 text-white border-gray-800"
                        : "bg-gray-200 text-gray-800 border-gray-300"
                      }`}
                  >
                    {c.key}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-4 pl-2 pr-16 pb-8">
                {filteredProducts.map((product) => (
                  <Product key={product.id} {...product} />
                ))}
              </div>
            </Scrollbars>
          </div>
        </div>
      </div>
      <div className="relative">
        <div className="flex min-h-[280px] h-[280px] w-full items-center justify-around shadow-lg relative z-20 bg-white">
          <span>{productInCarts} Items</span> {/** Dont like it that way rn */}
          <button
            className="bg-red-700 h-16 w-64 rounded-md text-white text-xl"
            onClick={() => {
              clearOrder();
              goTo({ name: "START" });
            }}
          >
            Cancel Order
          </button>
        </div>
      </div>
    </div>
  );
};
export default MenuScreen;
