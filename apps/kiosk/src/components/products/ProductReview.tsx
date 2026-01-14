import { OrderItem } from "@openpos/socket-contracts";

const ProductReview = ({ item, index }: { item: OrderItem, index: number }) => {
    return (

        <div className={"p-2 flex justify-between font-bold " + (((index) % 2 !== 0) ? "bg-gray-200" : "")}>
            <div className="flex gap-2">
                <img src={item.imageUrl} className="w-20 h-20 object-cover rounded-md" />
                <div className="flex flex-row">
                    <span className="text-xl">{item.name} x {item.quantity}</span>
                </div>
            </div>
            <span className="">Edit</span>
        </div>
    )
}

export default ProductReview;