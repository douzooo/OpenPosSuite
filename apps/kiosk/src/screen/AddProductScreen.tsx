import { Product } from "@openpos/socket-contracts";
import { useScreen } from "../state/useScreen";
import { useOrder } from "../hooks/useOrder";
import NumberInput from "../components/inputs/NumberInput";
import { useState } from "react";
interface AddProductScreenProps {
  product: Product;
}

const AddProductScreen = ({ product }: AddProductScreenProps) => {
  const {addProduct} = useOrder();
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
        <h1 className="text-4xl font-bold">{product.name}</h1>
        <p className="text-xl mt-2">${product.price}</p>

        <NumberInput value={quantity} onChange={(value) => {
          console.log("Quantity changed to:", value);
          setQuantity(value);
        }} />
        <button
          onClick={() => {
            addProduct({...product, quantity});
            goTo({ name: "MENU" });
          }}
        >
          Add to Cart{/** TODO: Success animation in future? */}
        </button>
      </div>
    </div>
  );
};

export default AddProductScreen;
