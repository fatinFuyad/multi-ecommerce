import { IShippingAddress, UserShippingAddressType } from "@/models/Order";
import { ICountry } from "@/models/Shipping-Rate";
import { Dispatch, FC, SetStateAction, useEffect } from "react";
import ShippingAddressCard from "../../cards/address-card";

interface Props {
  addresses: UserShippingAddressType[];
  countries: ICountry[];
  selectedAddress: IShippingAddress | null;
  setSelectedAddress: Dispatch<SetStateAction<IShippingAddress | null>>;
}

const AddressList: FC<Props> = ({
  addresses,
  countries,
  selectedAddress,
  setSelectedAddress
}) => {
  useEffect(() => {
    // Find the default address if it exists and set it as selected
    const defaultAddress = addresses.find((address) => address.default);
    if (defaultAddress) {
      setSelectedAddress({ ...defaultAddress, country: defaultAddress.country._id });
    }
  }, [addresses]);

  // const haneldeAddressSelect = (address: IShippingAddress) => {
  const haneldeAddressSelect = (address: UserShippingAddressType) => {
    setSelectedAddress({ ...address, country: address.country._id });
  };

  return (
    <div className="space-y-5 max-h-80 overflow-y-auto">
      {addresses.map((address) => (
        <ShippingAddressCard
          key={address._id}
          address={address}
          countries={countries}
          isSelected={selectedAddress?._id === address._id}
          onSelect={() => haneldeAddressSelect(address)}
        />
      ))}
    </div>
  );
};

export default AddressList;
