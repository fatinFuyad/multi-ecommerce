import { useToast } from "@/hooks/use-toast";
import { CartProductType } from "@/lib/types";
import { saveUserCart } from "@/services/user";
import { useRouter } from "next/navigation";
import { FC, useState } from "react";
import { PulseLoader } from "react-spinners";
import { Button } from "../ui/button";

interface Props {
  cartItems: CartProductType[];
  totalShippingFee: number;
}

const CartSummary: FC<Props> = ({ cartItems, totalShippingFee }) => {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Calculate subtotal from cartItems
  const subtotal = cartItems.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);

  // Calculate total price including shipping fees
  const total = subtotal + totalShippingFee;
  const handleSaveCart = async () => {
    try {
      setIsLoading(true);
      const res = await saveUserCart(cartItems);
      if (res) router.push("/checkout");
      toast({
        title: "Successfully checked out. Cart is saved in database",
        description: res.createdAt + " " + res.total + " " + res.subTotal
      });
      setIsLoading(false);
    } catch (error: any) {
      toast({
        description: error.message || error.toString(),
        variant: "destructive"
      });
    }
  };

  return (
    <div className="relative py-4 px-6 bg-background">
      <h1 className="text-card-foreground text-2xl font-bold mb-4">Summary</h1>
      <div className="mt-4 font-medium flex items-center text-card-foreground text-sm pb-1 border-b">
        <h2 className="overflow-hidden whitespace-nowrap text-ellipsis break-normal">
          Subtotal
        </h2>
        <h3 className="flex-1 w-0 min-w-0 text-right">
          <span className="px-0.5 text-secondary-foreground">
            <div className="text-secondary-foreground text-lg inline-block break-all">
              ${subtotal.toFixed(2)}
            </div>
          </span>
        </h3>
      </div>
      <div className="mt-2 font-medium flex items-center text-card-foreground text-sm pb-1 border-b">
        <h2 className="overflow-hidden whitespace-nowrap text-ellipsis break-normal">
          Shipping Fees
        </h2>
        <h3 className="flex-1 w-0 min-w-0 text-right">
          <span className="px-0.5 text-secondary-foreground">
            <div className="text-secondary-foreground text-lg inline-block break-all">
              +${totalShippingFee.toFixed(2)}
            </div>
          </span>
        </h3>
      </div>
      <div className="mt-2 font-medium flex items-center text-card-foreground text-sm pb-1 border-b">
        <h2 className="overflow-hidden whitespace-nowrap text-ellipsis break-normal">
          Taxes
        </h2>
        <h3 className="flex-1 w-0 min-w-0 text-right">
          <span className="px-0.5 text-secondary-foreground">
            <div className="text-secondary-foreground text-lg inline-block break-all">
              +$0.00
            </div>
          </span>
        </h3>
      </div>
      <div className="mt-2 font-bold flex items-center text-card-foreground text-sm">
        <h2 className="overflow-hidden whitespace-nowrap text-ellipsis break-normal">
          Total
        </h2>
        <h3 className="flex-1 w-0 min-w-0 text-right">
          <span className="px-0.5 text-secondary-foreground">
            <div className="text-secondary-foreground text-lg inline-block break-all">
              ${total.toFixed(2)}
            </div>
          </span>
        </h3>
      </div>
      <div className="my-2 5">
        <Button onClick={() => handleSaveCart()}>
          {isLoading ? (
            <PulseLoader size={5} color="#fff" />
          ) : (
            <span>Checkout ({cartItems.length})</span>
          )}
        </Button>
      </div>
    </div>
  );
};

export default CartSummary;
