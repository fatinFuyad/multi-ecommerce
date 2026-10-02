"use client";

import { ProductCardType } from "@/lib/types";
import { IStore } from "@/models/Store";
import { getProducts } from "@/services/product";
import { FC, useEffect, useState } from "react";
import ProductList from "../shared/product-list";

type Props = {
  store: Pick<IStore, "_id" | "name" | "url">;
  numProducts?: number;
};

// making this componet client so that after finishing all of the server requests, it sends another request from the client. Thus reduce initial load time

const StoreProducts: FC<Props> = ({ store, numProducts = 10 }) => {
  const [products, setProducts] = useState<ProductCardType[]>([]);

  useEffect(() => {
    const getStoreProducts = async () => {
      const products = await getProducts({ store: store._id, limit: `${numProducts}` });
      console.log("PRODUCTS STORE-->", products);
      setProducts(products);
    };
    getStoreProducts();
  }, []);

  return (
    <div className="relative mt-6">
      <ProductList products={products} title={`Recommended from ${store.name}`} arrow />
    </div>
  );
};

export default StoreProducts;
