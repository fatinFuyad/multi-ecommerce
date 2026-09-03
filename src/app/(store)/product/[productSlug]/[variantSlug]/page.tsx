import ProductPageContainer from "@/components/store/product-page/container";
import { ProductDetailedType } from "@/lib/types";
import { getProducts, getProductVariants } from "@/queries/product";
import { Separator } from "@radix-ui/react-separator";
import { notFound, redirect } from "next/navigation";

interface PageProps {
  params: { productSlug: string; variantSlug: string };
  searchParams: {
    size?: string;
  };
}

export default async function ProductVariantPage({
  params: { productSlug, variantSlug },
  searchParams: { size: sizeId }
}: PageProps) {
  // Fetch product data based on the product slug and variant slug
  // ℹ️ Can not directly pass mongoose docs to client components
  const productRes = await getProducts<ProductDetailedType>(`slug=${productSlug}`, {
    lean: true,
    populate: "category,subcategory,store,offerTag,variants"
  });
  const variantRes = await getProductVariants(`product=${productRes.products[0]._id}`);

  // If no product data is found, show the 404 Not Found page
  if (!productRes.products.length || !variantRes.variants.length) {
    return notFound();
    //return redirect("/");
  }

  // productData contains the variant matches the variantSlug in an array.
  const [productData] = productRes.products;
  productData.variants = variantRes.variants.filter(
    (variant) => variant.slug === variantSlug
  );

  // Extract the available sizes for the product variant
  const { sizes } = productData.variants[0];

  // If the size is provided in the URL
  if (sizeId) {
    // Check if the provided sizeId is valid by comparing with available sizes
    const isValidSize = sizes.some((size) => size._id.toString() === sizeId);

    // If the sizeId is not valid, redirect to the same product page without the size parameter
    if (!isValidSize) {
      return redirect(`/product/${productSlug}/${variantSlug}`);
    }
  } else if (sizes.length === 1) {
    // If no sizeId is provided and there's only one size available, automatically select it
    return redirect(
      `/product/${productSlug}/${variantSlug}?size=${sizes[0]._id}` // Redirect to the URL with the size parameter prefilled
    );
  }

  const { questions, category } = productData;
  const specs = {
    product: productData.specifications,
    variant: productData.variants[0].specifications
  };

  // const relatedProducts = await getProducts(`category=${category._id}&limit=12`);

  return (
    <div>
      <div className="max-w-[1650px] mx-auto p-4 overflow-x-hidden">
        <ProductPageContainer
          productData={productData}
          variants={variantRes.variants}
          sizeId={sizeId}
        >
          {
            <>
              <Separator />
              {/* RELATED PRODUCTS*/}
            </>
          }
          <Separator className="mt-6" />
          {/* PRODUCT REVIEWS */}
          <Separator className="mt-6" />
          {/* PRODUCT DESCRIPTION */}

          {(specs.product.length > 0 || specs.variant.length > 0) && (
            <>
              <Separator className="mt-6" />
              {/* SPECIFICATION TABLE */}
            </>
          )}
          {questions.length > 0 && (
            <>
              <Separator className="mt-6" />
              {/* PRODUCT QUESTIONS */}
            </>
          )}
          <Separator className="my-6" />
          {/* STORE CARD */}
          {/* STORE PRODUCTS */}
        </ProductPageContainer>
      </div>
    </div>
  );
}
