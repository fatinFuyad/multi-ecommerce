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
import axios from "@/lib/axios";
import { ProductFormSchema, ProductFormSchemaType } from "@/lib/schemas";
import { ApiResponse, ProductWithVariant } from "@/lib/types";
import { CategoryDoc } from "@/models/Category";
import { ProductDoc } from "@/models/Product";
import { SubcategoryDoc } from "@/models/Subcategory";
// import { getAllSubcategories, getSubcategoriesForCategory } from "@/queries/subcategory";
import { useEffect, useState } from "react";
import ImagePreviewGrid from "../shared/image-preview-grid";
import AddInput from "./add-input";

interface ProductDetailsProps {
  data?: ProductWithVariant;
  categories: CategoryDoc[];
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

export default function ProductDetails({ data, categories }: ProductDetailsProps) {
  const { toast } = useToast();
  const variant = data?.variants[0]; //|| ({} as IProductVariant);
  // Temporary state for preserving previous images
  const [images, setImages] = useState<ProductFormSchemaType["images"]>(defaultImages);
  const [colors, setColors] = useState<{ color: string }[]>(
    () => variant?.colors || [{ color: "" }]
  );
  const [sizes, setSizes] = useState<ProductFormSchemaType["sizes"]>([
    { size: "", quantity: 1, price: 0, discount: 0 }
  ]);
  // State for subcategories
  const [subcategories, setSubcategories] = useState<SubcategoryDoc[]>([]);

  // 1. Define your form.
  const form = useForm<ProductFormSchemaType>({
    resolver: zodResolver(ProductFormSchema),
    defaultValues: {
      name: data?.name || "",
      description: data?.description || "",
      variantName: variant?.variantName || "",
      variantDescription: variant?.variantDescription || "",
      images: variant?.images || images,
      variantImage: [{ url: variant?.variantImage || "" }],
      category: data?.category.toString() || "",
      subcategory: data?.subcategory.toString() || "",
      brand: data?.brand.toString() || "",
      sku: variant?.sku || "",
      keywords: variant?.keywords ? variant.keywords.split(" ") : [],
      colors: variant?.colors || [],
      sizes: variant?.sizes || [
        {
          size: "",
          quantity: 0,
          price: 0,
          discount: 0
        }
      ],
      isSale: variant?.isSale || false,
      saleEndDate: variant?.saleEndDate || ""
    }
  });

  const isSubmitting = form.formState.isSubmitting;
  const errors = form.formState.errors;

  // Whenever colors, sizes, keywords changes we update the form values

  useEffect(() => {
    form.setValue("colors", colors);
    form.setValue("sizes", sizes);
  }, [form, colors, sizes]);
  // console.log(form.watch("sizes"));

  // Get subcategories for particular category
  // useEffect(() => {
  //   console.log("Categoryform: ", form.watch().category);
  //   async function subcategories() {
  //     const results = await getAllSubcategories<SubcategoryDoc>({
  //       query: `category=${form.watch().category}`
  //     });
  //     setSubcategories(results || []);
  //   }
  //   subcategories();
  // }, [form.watch().category]);

  // 2. Define a submit handler.
  const isLogTemp: boolean = true;
  async function onSubmit(values: ProductFormSchemaType) {
    try {
      console.log(errors);
      console.log(values);
      if (isLogTemp) return;
      const isUpdateSession = !!data?._id;
      let response;
      if (isUpdateSession) {
        response = await axios.patch<ApiResponse<{ product: ProductDoc }>>(
          `/products/${data._id}`,
          values
        );
      } else {
        response = await axios.post<ApiResponse<{ product: ProductDoc }>>(
          `/products`,
          values
        );
      }
      toast({
        title: "Congratulations!",
        description: isUpdateSession
          ? `Your product ${response.data.product.name} has been updated successfully`
          : `Your product ${response.data.product.name} has been created successfully`
      });
      form.reset();
    } catch (error: any) {
      toast({
        title: "An Error Occured",
        description:
          error.response?.data.message ||
          "Unexpected error while creating/updating the product",
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
                    <FormItem className="flex-grow">
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
                    <FormItem className="flex-grow">
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
                    <FormItem className="flex-grow">
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
                    <FormItem className="flex-grow">
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
                      <FormItem className="flex-grow justify-self-end">
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
                {form.watch().category && (
                  <FormField
                    control={form.control}
                    name="subcategory"
                    render={({ field }) => {
                      return (
                        <FormItem className="flex-grow">
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
                    <FormItem className="flex-grow">
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
                    <FormItem className="flex-grow">
                      <FormLabel>SKU</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter product sku" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                  <span className="text-sm font-medium text-destructive">
                    {errors.sizes.message}
                  </span>
                )}
              </div>
              {/* IS PRODUCT ON SALE */}
              <div className="flex w-fit border rounded-md">
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
