"use client";

// Form handling utilities
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

// UI Components
import { AlertDialog } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import ImageUpload from "../shared/image-upload";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import { useToast } from "@/hooks/use-toast";
import { upsertProduct, upsertProductForm } from "@/lib/product-actions";
import { ProductFormSchema, ProductFormSchemaType } from "@/lib/schemas";
import { ProductWithVariant } from "@/lib/types";
import { CategoryDoc } from "@/models/Category";
import { SubcategoryDoc } from "@/models/Subcategory";
import { getAllSubcategories } from "@/queries/subcategory";
import { XIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { WithOutContext as ReactTags } from "react-tag-input";
import ImagePreviewGrid from "../shared/image-preview-grid";
import AddInput from "./add-input";
import { upsertProductReq } from "@/queries/product";
import { ProductDoc, ProductVariantDoc } from "@/models/Product";
import { Types } from "mongoose";

interface ProductDetailsProps {
  data?: ProductWithVariant;
  categories: CategoryDoc[];
  storeUrl: string;
}

interface Keyword {
  id: string;
  text: string;
}

const defaultImages = [
  {
    url: "https://res.cloudinary.com/dxgghtydz/image/upload/v1783870574/qyueknavm5uz4cqimiq4.jpg"
  },
  {
    url: "https://res.cloudinary.com/dxgghtydz/image/upload/v1783868821/ihcat9omf7rmsrlzlv3n.jpg"
  },
  {
    url: "https://res.cloudinary.com/dxgghtydz/image/upload/v1783868764/ymdhb1kivvkjqfnz78ip.jpg"
  },
  {
    url: "https://res.cloudinary.com/dxgghtydz/image/upload/v1783868741/grax8gssgneloi5aprim.jpg"
  },
  {
    url: "https://res.cloudinary.com/dxgghtydz/image/upload/v1783868733/hqsjma6yndjkabl96zyw.jpg"
  },
  {
    url: "https://res.cloudinary.com/dxgghtydz/image/upload/v1783867318/ovlxxb9ktg4rhhjaikgf.jpg"
  }
];

const defaultSizes = [
  {
    size: "xl",
    quantity: 5,
    price: 10,
    discount: 15
  },
  {
    size: "lg",
    quantity: 10,
    price: 8,
    discount: 10
  }
];
const defaultKeywords = ["Dreamcore", "comfortable", "premium", "cotton", "ultra"];
const defaultColors = [
  {
    color: "#ffffff"
  },
  {
    color: "#C9D5F4"
  },
  {
    color: "#2B467E"
  }
];

export default function ProductDetails({
  data,
  categories,
  storeUrl
}: ProductDetailsProps) {
  const { toast } = useToast();
  const variant = data?.variants[0]; //|| ({} as IProductVariant);
  // Temporary state for preserving previous images
  const [images, setImages] = useState<ProductFormSchemaType["images"]>(defaultImages);
  const [colors, setColors] = useState<{ color: string }[]>(
    () => variant?.colors || defaultColors || [{ color: "" }]
  );
  const [sizes, setSizes] = useState<ProductFormSchemaType["sizes"]>(defaultSizes);
  const [keywords, setKeywords] = useState<string[]>(defaultKeywords);
  // State for subcategories
  const [subcategories, setSubcategories] = useState<SubcategoryDoc[]>([]);

  // 1. Define your form.
  const form = useForm<ProductFormSchemaType>({
    resolver: zodResolver(ProductFormSchema),
    // defaultValues: {
    //   name: data?.name || "",
    //   description: data?.description || "",
    //   variantName: variant?.variantName || "",
    //   variantDescription: variant?.variantDescription || "",
    //   images: variant?.images || images,
    //   variantImage: [{ url: variant?.variantImage || "" }],
    //   category: data?.category.toString() || "",
    //   subcategory: data?.subcategory.toString() || "",
    //   brand: data?.brand.toString() || "",
    //   sku: variant?.sku || "",
    //   keywords: variant?.keywords ? variant.keywords.split(" ") : [],
    //   colors: variant?.colors || [],
    //   sizes: variant?.sizes || [
    //     {
    //       size: "",
    //       quantity: 0,
    //       price: 0,
    //       discount: 0
    //     }
    //   ],
    //   isSale: variant?.isSale || false,
    //   saleEndDate: variant?.saleEndDate || ""
    // }
    defaultValues: {
      name: "Mens Premium Casual Shirt",
      description:
        "The Dreamcore Casual Shirt is crafted for the man who finds beauty in texture, subtlety, and thoughtfully layered style. Built from a premium Grey Y/D Plain Slub fabric with Beige and Tan Dobby contrast detailing, the Dreamcore carries a soft, organic character that feels simultaneously relaxed and refined. Its natural tonal palette and pure cotton construction make it the kind of shirt you reach for again and again — whether it's a relaxed weekend, a smart-casual day out, or any occasion that calls for effortless, considered style.",
      variantName: "Dreamcore",
      variantDescription:
        "The Dreamcore Casual Shirt is crafted for the man who finds beauty in texture, subtlety, and thoughtfully layered style. Built from a premium Grey Y/D Plain Slub fabric with Beige and Tan Dobby contrast detailing, the Dreamcore carries a soft, organic character that feels simultaneously relaxed and refined. Its natural tonal palette and pure cotton construction make it the kind of shirt you reach for again and again — whether it's a relaxed weekend, a smart-casual day out, or any occasion that calls for effortless, considered style.",
      images: [
        {
          url: "https://res.cloudinary.com/dxgghtydz/image/upload/v1783870574/qyueknavm5uz4cqimiq4.jpg"
        },
        {
          url: "https://res.cloudinary.com/dxgghtydz/image/upload/v1783868821/ihcat9omf7rmsrlzlv3n.jpg"
        },
        {
          url: "https://res.cloudinary.com/dxgghtydz/image/upload/v1783868764/ymdhb1kivvkjqfnz78ip.jpg"
        },
        {
          url: "https://res.cloudinary.com/dxgghtydz/image/upload/v1783868741/grax8gssgneloi5aprim.jpg"
        },
        {
          url: "https://res.cloudinary.com/dxgghtydz/image/upload/v1783868733/hqsjma6yndjkabl96zyw.jpg"
        },
        {
          url: "https://res.cloudinary.com/dxgghtydz/image/upload/v1783867318/ovlxxb9ktg4rhhjaikgf.jpg"
        }
      ],
      variantImage: [
        {
          url: "https://res.cloudinary.com/dxgghtydz/image/upload/v1783870574/qyueknavm5uz4cqimiq4.jpg"
        }
      ],
      category: "6a605c3165fc6b0b3f2fdcb7",
      subcategory: "6a605db565fc6b0b3f2fdce0",
      brand: "Dreamcore",
      sku: "dreamcore_1010",
      keywords: ["Dreamcore", "comfortable", "premium", "cotton", "ultra"],
      colors: [
        {
          color: "#ffffff"
        },
        {
          color: "#C9D5F4"
        },
        {
          color: "#2B467E"
        }
      ],
      sizes: [
        {
          size: "xl",
          quantity: 5,
          price: 10,
          discount: 15
        },
        {
          size: "lg",
          quantity: 10,
          price: 8,
          discount: 10
        }
      ],
      isSale: true,
      saleEndDate: ""
    }
  });

  const isSubmitting = form.formState.isSubmitting;
  const errors = form.formState.errors;

  // Whenever colors, sizes, keywords changes we update the form values
  // console.log(form.watch("sizes"));

  useEffect(() => {
    form.setValue("colors", colors);
    form.setValue("sizes", sizes);
    form.setValue("keywords", keywords);
  }, [form, colors, sizes, keywords]);

  // Get subcategories for particular category
  const categoryField = form.watch("category");
  useEffect(() => {
    async function subcategories() {
      const results = await getAllSubcategories<SubcategoryDoc>({
        query: `category=${categoryField}`
      });
      setSubcategories(results || []);
    }

    if (!categoryField) return;
    subcategories();
  }, [categoryField]);

  // handlers
  function handleAddKeyword(keyword: Keyword) {
    setKeywords((prevState) => [...prevState, keyword.text]);
  }
  function handleDeleteKeyword(index: number) {
    setKeywords((prevState) => prevState.filter((key, i) => i !== index));
  }
  console.log(errors.sizes);
  // 2. Define a submit handler.
  async function onSubmit(values: ProductFormSchemaType) {
    try {
      console.log(values);
      const isUpdateSession = !!data?._id;
      // const response = await upsertProduct(values, storeUrl);
      const response = await upsertProductReq<
        { product: ProductDoc; productVariant: ProductVariantDoc },
        ProductFormSchemaType & { productId?: Types.ObjectId; storeUrl: string }
      >("/products", { ...values, productId: data?._id, storeUrl });
      console.log(response);

      toast({
        title: "Congratulations!",
        description: isUpdateSession
          ? `Your product ${response.product.name} and variant ${response.productVariant.variantName} has been updated successfully`
          : `Your product ${response.product.name} and variant ${response.productVariant.variantName} has been created successfully`
      });
      // form.reset();
    } catch (error: any) {
      console.log(error);
      toast({
        title: "An Error Occured",
        description:
          error.message || "Unexpected error while creating/updating the product",
        variant: "destructive"
      });
    }
  }

  return (
    <AlertDialog>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Product Information</CardTitle>
          <CardDescription>
            {data?._id
              ? `Update ${data?.name} product information.`
              : "Lets create a product. You can edit product later from the categories table or the product page."}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
              {/* IMAGES and COLORS */}
              <div className="flex flex-col gap-y-6 2xl:justify-between 2xl:gap-10 2xl:flex-row">
                {/* PRODUCT IMAGES */}
                <FormField
                  control={form.control}
                  name="images"
                  render={({ field }) => (
                    <FormItem className="w-full 2xl:border-r 2xl:pr-4">
                      <FormControl>
                        <>
                          <ImagePreviewGrid
                            images={form.getValues().images}
                            onRemove={(url) => {
                              const updatedImages = images.filter(
                                (img) => img.url !== url
                              );
                              setImages(updatedImages);
                              field.onChange(updatedImages);
                            }}
                            colors={colors}
                            setColors={setColors}
                          />
                          <FormMessage className="mt-4" />
                          <ImageUpload
                            showPreview={false}
                            type="standard"
                            value={field.value.map((image) => image.url)}
                            disabled={isSubmitting}
                            onChange={(url) => {
                              // the prev images do not persist in the form state. therefore using a useState hook
                              setImages((prevImages) => {
                                const updatedImages = [...prevImages, { url }];
                                field.onChange(updatedImages);
                                return updatedImages;
                              });
                            }}
                            onRemove={(url) => {
                              field.onChange([
                                ...field.value.filter((current) => current.url !== url)
                              ]);
                            }}
                          />
                        </>
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* CLICK TO ADD COLOR INPUTS */}
                <div className="w-2/6 flex flex-col gap-y-3 xl:pl-5">
                  <AddInput<{ color: string }>
                    header="Color"
                    inputDetails={colors}
                    initialInputDetail={{ color: "" }}
                    setInputDetails={setColors}
                    colorPicker
                  />
                  {errors.colors && (
                    <span className="text-sm font-medium text-destructive">
                      {errors.colors.message}
                    </span>
                  )}
                </div>
              </div>
              {/* PRODUCT NAME AND VARIANT */}
              <div className="flex flex-col lg:flex-row gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Product Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter product name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="variantName"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Variant Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter variant name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {/* DESCRIPTION FOR PRODUCT AND VARIANT */}
              <div className="flex flex-col lg:flex-row gap-6">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          // className="resize-none"
                          placeholder="Describe your product"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="variantDescription"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Description for variant</FormLabel>
                      <FormControl>
                        <Textarea
                          // className="resize-none"
                          placeholder="Describe your product variant"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {/* CATEGORIES AND SUBCATEGORIES */}
              <div className="flex flex-col justify-between lg:flex-row gap-6">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => {
                    return (
                      <FormItem className="flex-1 justify-self-end">
                        <FormLabel>Select Category</FormLabel>
                        <Select
                          disabled={isSubmitting}
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a parent category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.map((category, i) => (
                              <SelectItem key={i} value={category._id.toString()}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    );
                  }}
                />
                {categoryField && (
                  <FormField
                    control={form.control}
                    name="subcategory"
                    render={({ field }) => {
                      return (
                        <FormItem className="flex-1">
                          <FormLabel>Select Subcategory</FormLabel>
                          <Select
                            disabled={isSubmitting}
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select subcategory" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {subcategories.map((subcategory, i) => (
                                <SelectItem key={i} value={subcategory._id.toString()}>
                                  {subcategory.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      );
                    }}
                  />
                )}
              </div>
              {/* BRAND AND SKU OF PRODUCT */}
              <div className="flex flex-col lg:flex-row gap-6">
                <FormField
                  control={form.control}
                  name="brand"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Brand</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter brand for product" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="sku"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>SKU</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter product sku" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {/* KEYWORDS */}
              <div className="w-full flex-1 space-y-3">
                <FormField
                  control={form.control}
                  name="keywords"
                  render={() => (
                    <FormItem className="relative flex-1">
                      <FormLabel>Product Keywords</FormLabel>
                      <FormControl>
                        <ReactTags
                          handleAddition={handleAddKeyword}
                          handleDelete={() => {}}
                          placeholder="Keywords (e.g., winter jacket, warm, stylish)"
                          classNames={{
                            tagInputField:
                              "bg-background border rounded-md p-2 w-full focus:outline-none"
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex flex-wrap gap-1">
                  {keywords.map((k, i) => (
                    <div
                      key={i}
                      className="text-xs inline-flex items-center px-3 py-1 bg-blue-200 text-blue-700 rounded-full gap-x-2"
                    >
                      <span>{k}</span>
                      <XIcon
                        className="cursor-pointer size-4"
                        onClick={() => handleDeleteKeyword(i)}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* SIZES*/}
              <div className="w-full flex flex-col gap-y-3">
                <AddInput
                  initialInputDetail={{ size: "", quantity: 0, price: 0, discount: 0 }}
                  inputDetails={sizes}
                  setInputDetails={setSizes}
                  header="Size | Quantity | Price | Discount"
                />
                {errors.sizes && (
                  <>
                    <span className="text-sm font-medium text-destructive capitalize">
                      {Array.isArray(errors.sizes) &&
                        errors.sizes
                          .map((err) =>
                            Object.entries(err)
                              .map(
                                ([field, value]: any[]) => `${field}: ${value.message}`
                              )
                              .join("  ")
                          )
                          .join(". ")}
                    </span>
                    <span className="text-sm font-medium text-destructive">
                      {errors.sizes.message}
                    </span>
                  </>
                )}
              </div>
              {/* IS PRODUCT ON SALE */}
              <div className="flex border rounded-md">
                <FormField
                  control={form.control}
                  name="isSale"
                  render={({ field }) => (
                    <FormItem className="flex items-center flex-row gap-3 px-4 py-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>On Sale</FormLabel>
                        <FormDescription>Is this product on sale?</FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" disabled={isSubmitting}>
                {form.formState.isSubmitting
                  ? "Submitting..."
                  : data?._id
                    ? "Save Product Data"
                    : "Create Product"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </AlertDialog>
  );
}
