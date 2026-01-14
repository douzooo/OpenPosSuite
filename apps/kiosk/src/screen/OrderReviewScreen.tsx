import { Product } from "@openpos/socket-contracts";
import { useScreen } from "../state/useScreen";
import { useOrder } from "../hooks/useOrder";
import NumberInput from "../components/inputs/NumberInput";
import { useState } from "react";
import ProductReview from "../components/products/ProductReview";

const OrderReviewScreen = () => {
    const { order } = useOrder();
    const { goTo } = useScreen();

    const [quantity, setQuantity] = useState(1);

    return (
        <div className="absolute bg-white h-full w-full ">
            <button
                onClick={() => {
                    goTo({ name: "MENU" });
                }}
            >
                Back
            </button>

            <div className="text-black p-4">
                <h1 className="text-4xl font-bold">Check Order</h1>
                {order?.items.map((item, index) => (
                    <ProductReview item={item} key={item.id} index={index} />
                ))}

                <button
                    onClick={() => {
                        goTo({ name: "MENU" });
                    }}
                >
                    Checkout
                </button>
            </div>
        </div>
    );
};

export default OrderReviewScreen;
