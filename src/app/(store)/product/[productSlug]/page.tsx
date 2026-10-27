import { getProduct } from "@/services/product";
import { redirect } from "next/navigation";

interface PageProps {
  params: { productSlug: string };
}

export default async function ProductPage({ params }: PageProps) {
  // Fetch the product from the database using the provided slug
  // Include only one variant in the query
  const product = await getProduct<{
    slug: string;
    variants: { name: string; slug: string }[];
  }>(
    { slug: params.productSlug, fields: "slug" },
    {
      populate: "variants",
      fields: "name,slug",
      limitPopulateDoc: 1,
      lean: true
    }
  );

  // If the product is not found or  the product has no variants, redirect to the homepage
  if (!product || !product.variants.length) {
    return redirect("/");
  }

  // If the product exists and has variants, redirect to the first variant's page
  return redirect(`/product/${product.slug}/${product.variants[0].slug}`);
}
