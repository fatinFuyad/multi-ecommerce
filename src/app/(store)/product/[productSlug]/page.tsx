import { getProducts } from "@/queries/product";
import { redirect } from "next/navigation";

interface PageProps {
  params: { productSlug: string };
}

export default async function ProductPage({ params }: PageProps) {
  // Fetch the product from the database using the provided slug
  // Include only one variant in the query
  const productRes = await getProducts<any>(`slug=${params.productSlug}`, {
    populate: "variants",
    fields: "name,slug",
    limitPopulateDoc: 1
  });
  const product = productRes.products[0];

  // If the product is not found, redirect to the homepage
  if (!product) {
    return redirect("/");
  }

  // If the product has no variants, redirect to the homepage
  if (!product.variants.length) {
    return redirect("/");
  }
  console.log("product--->", product);
  // If the product exists and has variants, redirect to the first variant's page
  return redirect(`/product/${product.slug}/${product.variants[0].slug}`);
}
