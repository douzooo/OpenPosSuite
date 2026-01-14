import testCheeseburgerImage from "../../assets/cheeseburger.png";
import { Product as ProductType } from "@openpos/socket-contracts";
import style from "./Product.module.css";
import { useScreen } from "../../state/useScreen";
const Product = (product: ProductType) => {

  const { goTo } = useScreen();

  return (
    <div
      className={`w-full border rounded-xl aspect-3/4 p-5 max-w-60 border-gray-300 relative flex flex-col justify-between active:bg-black/15 select-none cursor-pointer nodrag ${product.label && style.label}`}
      product-label-new={product.label?.key || ""}
      onClick={
        ()=> {
          goTo({ name: "SELECT_PRODUCT", product:  product  });
        }
      }
    >
      <img
        src={testCheeseburgerImage}
        alt="Cheeseburger"
        className="w-full nodrag"
      />
      <div className="w-full flex flex-col">
        <span className="font-extrabold text-lg m-0">{product.name}</span>
        <span className="text-gray-700 -mt-1 font-bold">${product.price}</span>
      </div>
    </div>
  );
};

export default Product;
