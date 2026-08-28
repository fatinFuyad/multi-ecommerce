import ProductList from "@/components/store/shared/product-list";
import { ProductWithVariant, VariantImageType, VariantSimplified } from "@/lib/types";
import { getProducts } from "@/queries/product";

export default async function HomePage() {
  const { products } = await getProducts<ProductWithVariant>(undefined, {
    lean: true,
    populate: "variants"
  });

  // Transform the products with filtered variants into ProductCardType structure
  const productsWithFilteredVariants = products.map((product) => {
    // Filter the variants based on the filters
    const filteredVariants = product.variants;

    // Transform the filtered variants into the VariantSimplified structure
    const variants: VariantSimplified[] = filteredVariants.map((variant) => ({
      variantId: variant._id.toString(),
      variantSlug: variant.slug,
      variantName: variant.variantName,
      images: variant.images,
      sizes: variant.sizes
    }));

    // Extract variant images for the product
    const variantImages: VariantImageType[] = filteredVariants.map((variant) => ({
      url: `/product/${product.slug}/${variant.slug}`,
      image: variant.variantImage ? variant.variantImage : variant.images[0].url
    }));

    // Return the product in the ProductCardType structure
    return {
      _id: product._id.toString(),
      slug: product.slug,
      name: product.name,
      rating: product.rating,
      sales: product.sales,
      variants,
      variantImages
    };
  });

  return (
    <div className="p-14">
      <ProductList products={productsWithFilteredVariants} title="Products" arrow />
    </div>
  );
}
