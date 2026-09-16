import ProductPageContainer from "@/components/store/product-page/container";
import { Separator } from "@/components/ui/separator";
import { ProductDetailedType, ProductShippingDetailsType } from "@/lib/types";
import { IProductVariant } from "@/models/Product";
import { getProductPageData } from "@/services/product";
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

  // HTTP request originating from server does not automatically inherit the browser's cookies from the original request.
  // // const {}  = await getProductPageData(productSlug,variantSlug)
  // const cookieStore = cookies();
  // const data = await axios
  //   .get(
  //     `/products/product-page-data?productSlug=${productSlug}&variantSlug=${variantSlug}`,
  //     {
  //       headers: {
  //         Cookie: cookieStore.toString() // Forwarding cookies from original Request
  //       }
  //     }
  //   )
  //   .then((res) => res.data)
  //   .catch((err) => console.log(err.response?.data.message));

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
  const { sizes } = product.variants[0];

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
    variant: product.variants[0].specifications
  };

  // const relatedProducts = await getProducts(`category=${category._id}&limit=12`);

  return (
    <div>
      <div className="max-w-[1650px] mx-auto p-4 overflow-x-hidden">
        <ProductPageContainer
          productData={product}
          variants={variants}
          shippingDetails={shippingDetails}
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
