import { useEffect, useMemo, useState } from "react";
import { useInactivity } from "../hooks/useInactivity";
import { useScreen } from "../state/useScreen";
import { useOrder } from "../hooks/useOrder";
import { useProducts } from "../hooks/useProducts";
import Product from "../components/products/Product";
import Scrollbars from "react-custom-scrollbars-2";
import ScrollArea from "../components/ScrollContainer";
import { Category } from "../components/category/Category";
const MenuScreen = () => {
  const { clearOrder, order } = useOrder();
  const { goTo } = useScreen();

  useInactivity();

  let products = useProducts();
  products = products.sort((a, b) =>
    (b.label?.key || "").localeCompare(a.label?.key || "")
  );

  const [activeFilter, setActiveFilter] = useState("All");

  const filteredProducts = useMemo(() => {
    if (activeFilter === "Popular") {
      return products.filter(
        (p) => p.label?.key === "label.popular"
      );
    }
    if (activeFilter === "New") {
      return products.filter(
        (p) => p.label?.key === "label.new"
      );
    }
    return products;
  }, [products, activeFilter]);

  const productInCarts = useMemo(
    () => order?.items.reduce((sum, item) => sum + item.quantity, 0),
    [order]
  );

  const priceTotal = useMemo(
    () =>
      order?.items.reduce(
        (sum, item) => sum + item.quantity * (item.price || 0),
        0
      ),
    [order]
  );

  return (
    <div className="absolute inset-0 flex flex-col">
      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar */}
        <div className="w-60 shrink-0">
          <div className="p-4 text-2xl font-bold">Menu</div>
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 p-4 pb-0 overflow-hidden">
          <h1 className="text-6xl font-extrabold py-20">Burger</h1>

          <div className="flex-1 overflow-hidden relative">
            <ScrollArea>
              <div className="sticky top-0 z-1 bg-white p-4 flex gap-2 h-20 shadow-md">
                {["All", "Popular", "New"].map((key) => (
                  <Category
                    id={key}
                    name={key}
                    onClick={() => setActiveFilter(key)}
                    active={activeFilter === key}
                  />
                ))}
              </div>

              <div className="w-auto h-50 border rounded-2xl mx-2 mt-2"></div>
              {/* Product grid TODO: Add better responsiveness */}
              <div className="grid grid-cols-3 gap-4 px-2 py-4">
                {filteredProducts.map((product) => (
                  <Product key={product.id} {...product} />
                ))}
              </div>
            </ScrollArea>

            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: "10px",
                pointerEvents: "none",
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.1), transparent)",
                maskImage:
                  "linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)",
                WebkitMaskImage:
                  "linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)",
              }}
            />
          </div>

        </div>
      </div>

      <div className="relative z-20 bg-white">
        <div className="flex h-[280px] items-center justify-around">
          <span className="text-lg font-semibold">
            {productInCarts} Items ({priceTotal!!.toFixed(2)}$)
          </span>

          <div className="flex flex-col gap-2">
            <button
              className="bg-gray-200 h-16 w-64 rounded-md text-black text-xl"
              onClick={() => {
                goTo({ name: "ORDER_REVIEW" });
              }}
            >
              Bestellen
            </button>
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
    </div>
  );
};

export default MenuScreen;