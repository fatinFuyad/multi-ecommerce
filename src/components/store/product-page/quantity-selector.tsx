import { CartProductType } from "@/lib/types";
import { IVariantSize } from "@/models/Product";
import { Minus, Plus } from "lucide-react";
import { FC, useEffect } from "react";

interface QuantitySelectorProps {
  productId: string;
  variantId: string;
  sizeId: string | null;
  quantity: number;
  stock: number;
  handleChange: (property: keyof CartProductType, value: any) => void;
  sizes: IVariantSize[];
}

const QuantitySelector: FC<QuantitySelectorProps> = ({
  handleChange,
  productId,
  quantity,
  sizeId,
  sizes,
  variantId,
  stock
}) => {
  // Get cart product if it exist in cart, the get added quantity
  // const cart = useFromStore(useCartStore, (state) => state.cart);

  // useEffect hook to handle changes when sizeId updates
  useEffect(() => {
    handleChange("quantity", 1);
  }, [sizeId]);

  const maxQty = stock;
  // const maxQty = useMemo(() => {
  //   const search_product = cart?.find(
  //     (p) => p.productId === productId && p.variantId === variantId && p.sizeId === sizeId
  //   );
  //   return search_product ? search_product.stock - search_product.quantity : stock;
  // }, [cart, productId, variantId, sizeId, stock]);

  // Function to handle increasing the quantity of the product
  const handleIncrease = () => {
    if (quantity < stock) {
      handleChange("quantity", quantity + 1);
    }
  };

  // Function to handle decreasing the quantity of the product
  const handleDecrease = () => {
    if (quantity > 1) {
      handleChange("quantity", quantity - 1);
    }
  };

  return (
    <div className="w-full py-2 px-3 bg-secondary border rounded-lg">
      <div className="w-full flex justify-between items-center gap-x-5">
        <div className="grow">
          <span className="block text-xs text-muted-foreground">Select quantity</span>
          <span className="block text-xs text-muted-foreground">
            {maxQty !== stock &&
              `(You already have ${stock - maxQty} pieces of this product in cart)`}
          </span>
          <input
            type="number"
            className="w-full p-0 bg-transparent border-0 focus:outline-none text-card-foreground"
            min={1}
            value={maxQty <= 0 ? 0 : quantity}
            max={maxQty}
            readOnly
          />
        </div>
        <div className="flex justify-end items-center gap-x-1.5">
          <button
            className="size-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-full border border-muted bg-primary-light shadow-sm focus:outline-none focus:bg-muted-foreground disabled:opacity-50 disabled:pointer-events-none"
            onClick={handleDecrease}
            disabled={quantity === 1}
          >
            <Minus className="w-3" />
          </button>
          <button
            className="size-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-full border border-muted bg-primary-light shadow-sm focus:outline-none focus:bg-muted-foreground disabled:opacity-50 disabled:pointer-events-none"
            onClick={handleIncrease}
            disabled={quantity === stock}
          >
            <Plus className="w-3" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuantitySelector;
