import { CartProductType } from "@/lib/types";
import { IVariantSize } from "@/models/Product";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FC, useEffect } from "react";

interface Props {
  sizes: IVariantSize[];
  sizeId: string | undefined;
  handleChange: (property: keyof CartProductType, value: any) => void;
}

const SizeSelector: FC<Props> = ({ sizeId, sizes, handleChange }) => {
  const pathname = usePathname();

  const { replace } = useRouter();
  const searchParams = useSearchParams(); // for readonly operations with search params
  const params = new URLSearchParams(searchParams); // for crud operations with search params

  useEffect(() => {
    if (sizeId) {
      const searchSize = sizes.find((s) => s._id === sizeId);
      if (searchSize) {
        handleCartProductToBeAddedChange(searchSize);
      }
    }
  }, []);

  const handleSelectSize = (size: IVariantSize) => {
    params.set("size", size._id); // add new items to existing params
    handleCartProductToBeAddedChange(size);
    // changing size will change the url but not be considered as browsing history
    replace(`${pathname}?${params.toString()}`); // add all params with existing and new
  };

  const handleCartProductToBeAddedChange = (size: IVariantSize) => {
    handleChange("sizeId", size._id);
    handleChange("size", size.size);
  };

  return (
    <div className="flex flex-wrap gap-4">
      {sizes.map((size) => (
        <span
          key={size.size}
          className={`border rounded-full px-5 py-1 cursor-pointer hover:border-muted ${size._id === sizeId ? "bg-primary text-secondary" : ""}`}
          onClick={() => handleSelectSize(size)}
        >
          {size.size}
        </span>
      ))}
    </div>
  );
};

export default SizeSelector;
