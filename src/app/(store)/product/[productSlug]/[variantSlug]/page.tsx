import StoreCard from "@/components/store/cards/store-card";
import ProductPageContainer from "@/components/store/product-page/container";
import ProductDescription from "@/components/store/product-page/product-description";
import ProductQuestions from "@/components/store/product-page/product-questions";
import ProductSpecs from "@/components/store/product-page/product-specs";
import RelatedProducts from "@/components/store/product-page/related-product";
import StoreProducts from "@/components/store/product-page/store-products";
import { Separator } from "@/components/ui/separator";
import { ProductDetailedType, ProductShippingDetailsType } from "@/lib/types";
import { IProductVariant } from "@/models/Product";
import { getProductPageData, getProducts } from "@/services/product";
import { notFound, redirect } from "next/navigation";

interface PageProps {
  params: { productSlug: string; variantSlug: string };
  searchParams: {
    size?: string;
  };
}

interface ProductPageData {
  product: ProductDetailedType;
  variants: IProductVariant[];
  shippingDetails: ProductShippingDetailsType;
}

export default async function ProductVariantPage({
  params: { productSlug, variantSlug },
  searchParams: { size: sizeId }
}: PageProps) {
  // ℹ️ Can not directly pass mongoose docs to client components
  // Fetch product data based on the product slug and variant slug
  // product contains the active variant in variants property
  // the variants are all of the variants of a product
  const { product, shippingDetails, variants }: ProductPageData =
    await getProductPageData(productSlug, variantSlug);

  // If no product data is found, show the 404 Not Found page
  if (!product || !variants.length) {
    return notFound();
    //return redirect("/");
  }

  // Extract the available sizes for the product variant
  const variant = product.variants[0];
  const { sizes, variantDescription } = variant;

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

  const { questions } = product;
  const specs = {
    product: product.specifications,
    variant: variant.specifications
  };

  const relatedProducts = await getProducts(
    `/product/${productSlug}/${variantSlug}?subcategory=${product.subcategory._id}&limit=10&page=1`
  );

  return (
    <div>
      <div className="max-w-[1650px] mx-auto p-4 overflow-x-hidden">
        <ProductPageContainer
          productData={product}
          variants={variants}
          shippingDetails={shippingDetails}
          sizeId={sizeId}
        >
          {relatedProducts.length && (
            <>
              <Separator />
              {/* Related products */}
              <RelatedProducts products={relatedProducts} />
            </>
          )}
          <Separator className="mt-6" />
          {/* PRODUCT REVIEWS */}
          <>
            <Separator className="mt-6" />
            {/* Product description */}
            <ProductDescription text={[product.description, variantDescription || ""]} />
          </>
          {(specs.product.length > 0 || specs.variant.length > 0) && (
            <>
              <Separator className="mt-6" />
              {/* Specs table */}
              <ProductSpecs specs={specs} />
            </>
          )}
          {questions.length > 0 && (
            <>
              <Separator className="mt-6" />
              {/* Product Questions */}
              <ProductQuestions questions={product.questions} />
            </>
          )}
          <Separator className="my-6" />
          {/* Store card */}
          <StoreCard store={product.store} />
          {/* Store products */}
          <StoreProducts store={product.store} />
        </ProductPageContainer>
      </div>
    </div>
  );
}
