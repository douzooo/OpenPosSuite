import testCheeseburgerImage from "../../assets/cheeseburger.jpg";
import { Product as ProductType } from "@openpos/socket-contracts";


const Product = (product: ProductType) => {
  return (
    <div className="w-full border rounded-xl aspect-3/4 p-5 relative flex flex-col justify-between active:bg-black/15 select-none cursor-pointer nodrag">
      <img src={testCheeseburgerImage} alt="Cheeseburger" className="w-full nodrag" />
      <div className="w-full flex flex-col">
        <span className="font-extrabold text-lg m-0">{product.name}</span>
        <span className="text-gray-700 -mt-1 font-bold">${product.price}</span>
      </div>
    </div>
  );
};

export default Product;
