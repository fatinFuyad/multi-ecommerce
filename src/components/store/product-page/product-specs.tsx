import { cn } from "@/lib/utils";
import { ISpecification } from "@/models/Product";
import { FC } from "react";

interface Spec {
  name: string;
  value: string;
}

interface Props {
  specs: {
    product: ISpecification[];
    variant: ISpecification[];
  };
}

const ProductSpecs: FC<Props> = ({ specs }) => {
  const { product, variant } = specs;
  return (
    <div className="pt-6">
      {/* Title */}
      <div className="h-12">
        <h2 className="text-main-primary text-2xl font-bold">Specifications</h2>
      </div>
      {/* Product Specs Table */}
      <SpecTable data={product} />
      {/* Variant Specs Table */}
      <SpecTable data={variant} noTopBorder />
    </div>
  );
};

export default ProductSpecs;

const SpecTable = ({ data, noTopBorder }: { data: Spec[]; noTopBorder?: boolean }) => {
  return (
    <ul
      className={cn("border grid grid-cols-2", {
        "border-t-0": noTopBorder
      })}
    >
      {data.map((spec, i) => (
        <li
          key={i}
          className={cn("flex border-t", {
            "border-t-0": i === 0
          })}
        >
          <div className="float-left text-sm leading-7 max-w-[50%] relative w-1/2 flex">
            <div className="p-4 bg-secondary text-main-primary w-44">
              <span className="leading-5">{spec.name}</span>
            </div>
            <div className="p-4  text-secondary-foreground flex-1 break-words leading-5">
              <span className="leading-5">{spec.value}</span>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};
