import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { UserShippingAddressType } from "@/models/Order";
import { ICountry } from "@/models/Shipping-Rate";
import { upsertShippingAddress } from "@/services/user";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { FC, useState } from "react";
import Modal from "../shared/modal";
import AddressDetails from "../shared/shipping-addresses/address-details";

interface Props {
  address: UserShippingAddressType;
  isSelected: boolean;
  onSelect: () => void;
  countries: ICountry[];
}

const ShippingAddressCard: FC<Props> = ({ address, countries, isSelected, onSelect }) => {
  const router = useRouter();
  const [show, setShow] = useState(false);
  const { toast } = useToast();

  const handleMakeDefault = async () => {
    try {
      const { country, ...newAddress } = address;
      const response = await upsertShippingAddress({
        ...newAddress,
        country: country._id,
        default: true
      });

      if (response) {
        toast({ title: "New Default Address saved." });
        router.refresh();
      }
    } catch (error) {
      toast({ title: "Something went wrong !", variant: "destructive" });
    }
  };

  return (
    <div className="w-full relative flex self-start group">
      {/* Checkbox */}
      <label
        htmlFor={address._id}
        className="p-0 text-card-foreground text-sm leading-6 inline-flex items-center mr-3 cursor-pointer"
        onClick={onSelect}
      >
        <span className="leading-8 inline-flex p-0.5 cursor-pointer">
          <span
            className={cn(
              "leading-8 inline-block w-5 h-5 rounded-full bg-background border border-primary-light",
              {
                "bg-brand-primary border-none flex items-center justify-center":
                  isSelected
              }
            )}
          >
            {isSelected && <Check className="stroke-background w-3" />}
          </span>
        </span>
        <input type="checkbox" hidden id={address._id} />
      </label>
      {/* Address */}
      <div className="w-full border-t pt-2">
        {/* Full name - Phone number */}
        <div className="flex max-w-[328px] overflow-hidden text-ellipsis whitespace-nowrap">
          <span className="mr-4 text-sm text-secondary-foreground font-semibold capitalize">
            {address.firstName} {address.lastName}
          </span>
          <span>{address.phone}</span>
        </div>
        {/* Address 1 - Address 2 */}
        <div className="text-sm max-w-[90%] text-muted-foreground leading-4 overflow-hidden text-ellipsis whitespace-nowrap">
          {address.address1}
          {address.address2 && `, ${address.address2}`}
        </div>
        {/* State - City - Country - Zipcode */}
        <div className="text-sm max-w-[90%] text-muted-foreground leading-4 overflow-hidden text-ellipsis whitespace-nowrap">
          {address.state}, {address.city}, {address.country.name},&nbsp;
          {address.zipCode}
        </div>
        {/* Save as default - Edit */}
        <div className="absolute right-4 top-1/2 flex items-center gap-x-3">
          <div
            className="cursor-pointer hidden group-hover:block"
            onClick={() => setShow(true)}
          >
            <span className="text-brand-primary">Edit</span>
          </div>
          {isSelected && !address.default && (
            <div className="cursor-pointer" onClick={() => handleMakeDefault()}>
              <span className="text-brand-primary">Save as default</span>
            </div>
          )}
        </div>
        {show && (
          <Modal title="Edit Shipping Address" show={show} setShow={setShow}>
            <AddressDetails data={address} countries={countries} setShow={setShow} />
          </Modal>
        )}
      </div>
    </div>
  );
};

export default ShippingAddressCard;
