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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import axios from "@/lib/axios";
import { ProductFormSchemaType, ProductSchema } from "@/lib/schemas";
import { ApiResponse, ProductWithVariant } from "@/lib/types";
import { ProductDoc } from "@/models/Product";

interface ProductDetailsProps {
  data?: ProductWithVariant;
}

export default function ProductDetails({ data }: ProductDetailsProps) {
  const { toast } = useToast();
  const variant = data?.variants[0]; //|| ({} as IProductVariant);
  // 1. Define your form.
  const form = useForm<ProductFormSchemaType>({
    resolver: zodResolver(ProductSchema),
    defaultValues: {
      name: data?.name || "",
      description: data?.description || "",
      variantName: variant?.variantName || "",
      variantDescription: variant?.variantDescription || "",
      images: variant?.images || [{ url: "" }],
      variantImage: [{ url: variant?.variantImage || "" }],
      categoryId: data?.category.toString() || "",
      SubcategoryId: data?.Subcategory.toString() || "",
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

  // const isLoading = form.formState.isSubmitting;
  // 2. Define a submit handler.
  // ⚠️ Client side can't access backend models
  async function onSubmit(values: ProductFormSchemaType) {
    try {
      console.log(values);
      const isUpdateSession = !!data?._id;
      let response;
      // values.user = seller.user.id as;
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
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="relative py-2 mb-24">
                <FormField
                  control={form.control}
                  name="images"
                  render={({ field }) => (
                    <FormItem className="absolute -bottom-20 -left-48 z-10 inset-x-96">
                      <FormControl>
                        <ImageUpload
                          type="profile"
                          value={field.value.map((image) => image.url)}
                          onChange={(url) => field.onChange([{ url }])}
                          onRemove={(url) =>
                            field.onChange([
                              ...field.value.filter(
                                (current) => current.url !== url
                              )
                            ])
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="variantImage"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <ImageUpload
                          type="cover"
                          value={field.value.map((image) => image.url)}
                          onChange={(url) => field.onChange([{ url }])}
                          onRemove={(url) =>
                            field.onChange([
                              ...field.value.filter(
                                (current) => current.url !== url
                              )
                            ])
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter product name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
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

              {/* Email & Phone */}
              <div className="flex flex-col md:flex-row gap-16">
                <FormField
                  control={form.control}
                  name="brand"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Brand</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter brand for product"
                          {...field}
                        />
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
                        <Input
                          placeholder="Enter variantName for your product"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product url</FormLabel>
                    <FormControl>
                      <Input placeholder="unique-product-url" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}

              <FormField
                control={form.control}
                name="isSale"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Create sale</FormLabel>
                      <FormDescription>
                        This Product will have sale pricing
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={form.formState.isSubmitting}>
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
