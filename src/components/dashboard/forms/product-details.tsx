"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

// SHANDCN UI COMPONENTS
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

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// HOOKS, UTILITY FUNCTIONS & TYPES
import { useToast } from "@/hooks/use-toast";
import { ProductFormSchema, ProductFormSchemaType } from "@/lib/schemas";
import { ProductWithVariant } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ICategory } from "@/models/Category";
import { IProductVariant } from "@/models/Product";
import { ISubcategory } from "@/models/Subcategory";
import { upsertProduct } from "@/queries/product";
import { getSubcategories } from "@/queries/subcategory";
import { format } from "date-fns";
import { XIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { WithOutContext as ReactTags } from "react-tag-input";

// UITILITY UI COMPOENENTS
import DateTimePicker from "react-datetime-picker";

import "react-calendar/dist/Calendar.css";
import "react-clock/dist/Clock.css";
import "react-datetime-picker/dist/DateTimePicker.css";

import { IOfferTag } from "@/models/OfferTag";
import JoditEditor from "jodit-react";
import { useRouter } from "next/navigation";
import ImagePreviewGrid from "../shared/image-preview-grid";
import ImageUpload from "../shared/image-upload";
import AddInput from "./add-input";
import { NumberInput } from "@tremor/react";

interface ProductDetailsProps {
  data?: Partial<ProductWithVariant>;
  categories: ICategory[];
  offerTags: IOfferTag[];
  storeUrl: string;
}

interface Keyword {
  id: string;
  text: string;
}

const defaultImages = [
  {
    url: "https://res.cloudinary.com/dxgghtydz/image/upload/v1787804039/zw3q1cebqvnfy0u9yh0d.jpg"
  },
  {
    url: "https://res.cloudinary.com/dxgghtydz/image/upload/v1787804029/xqvt19qgbg8lhtdjlhjw.jpg"
  },
  {
    url: "https://res.cloudinary.com/dxgghtydz/image/upload/v1787803986/ayaqqoe6glkxkaedzkam.jpg"
  },
  {
    url: "https://res.cloudinary.com/dxgghtydz/image/upload/v1787803526/qdryy1yv0at8eeaweaxf.jpg"
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
const defaultProductSpecs = [
  { name: "Fabric", value: "Cotton" },
  { name: "Premimum", value: "Stich" },
  { name: "Color", value: "Standard" }
];
const defaultVariantSpecs = [
  { name: "Fabric", value: "Cotton" },
  { name: "Premimum", value: "Stich" },
  { name: "Color", value: "Standard" }
];
const defaultQuestions = [
  { question: "Is the quality premimum?", answer: "Offcourse" },
  { question: "Is the product in Stock", answer: "Yes! abundance in stock" },
  {
    question: "Is this thep product from original brand",
    answer: "Yeah! We don&apos;t sell local products"
  }
];

export default function ProductDetails({
  data,
  categories,
  offerTags,
  storeUrl
}: ProductDetailsProps) {
  const { toast } = useToast();
  const router = useRouter();

  const productDescEditor = useRef(null);
  const variantDescEditor = useRef(null);
  const variant = data?.variants && (data.variants[0] as IProductVariant);

  // state for preserving previous images
  const [images, setImages] = useState<ProductFormSchemaType["images"]>(
    variant?.images || defaultImages || []
  );
  const [colors, setColors] = useState<{ color: string }[]>(
    variant?.colors || defaultColors || [{ color: "" }]
  );
  const [sizes, setSizes] = useState<ProductFormSchemaType["sizes"]>(
    variant?.sizes || defaultSizes || [{ size: "", quantity: 0, price: 0, discount: 0 }]
  );
  const [productSpecs, setProductSpecs] = useState<
    {
      name: string;
      value: string;
    }[]
  >(() => data?.specifications || defaultProductSpecs || [{ name: "", value: "" }]);
  const [variantSpecs, setVariantSpecs] = useState<
    {
      name: string;
      value: string;
    }[]
  >(() => variant?.specifications || defaultVariantSpecs || [{ name: "", value: "" }]);
  const [questions, setQuestions] = useState<{ question: string; answer: string }[]>(
    () => data?.questions || defaultQuestions || [{ question: "", answer: "" }]
  );
  const [keywords, setKeywords] = useState<string[]>(defaultKeywords || []);
  const [subcategories, setSubcategories] = useState<ISubcategory[]>([]);

  // 1. Define your form.
  const form = useForm<ProductFormSchemaType>({
    resolver: zodResolver(ProductFormSchema),
    reValidateMode: "onBlur",
    defaultValues: {
      name: data?.name,
      description: data?.description,
      variantName: variant?.variantName,
      variantDescription: variant?.variantDescription || "",
      images: variant?.images || images,
      variantImage: variant?.variantImage ? [{ url: variant.variantImage }] : [],
      category: data?.category?.toString(),
      subcategory: data?.subcategory?.toString(),
      storeUrl: storeUrl,
      brand: data?.brand,
      sku: variant?.sku,
      weight: variant?.weight,
      keywords: variant?.keywords ? variant.keywords.split(" ") : [],
      colors: variant?.colors,
      sizes: variant?.sizes,
      productSpecs: data?.specifications,
      variantSpecs: variant?.specifications,
      questions: data?.questions,
      isSale: variant?.isSale || false,
      saleEndDate: variant?.saleEndDate || format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"),
      offerTagId: data?.offerTag?.toString() || ""
    }
  });

  const { isSubmitting, isSubmitSuccessful, errors } = form.formState;

  const { reset } = form;
  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
      router.refresh(); // refresh the page otherwise form shows previous data after reset
    }
  }, [reset, isSubmitSuccessful, router]);

  // whenever state changes we update the form values
  useEffect(() => {
    form.setValue("colors", colors);
    form.setValue("sizes", sizes);
    form.setValue("keywords", keywords);
    form.setValue("productSpecs", productSpecs);
    form.setValue("variantSpecs", variantSpecs);
    form.setValue("questions", questions);
    form.clearErrors();
  }, [form, colors, sizes, keywords, productSpecs, variantSpecs, questions]);

  // Get subcategories for particular category
  const categoryField = form.watch("category");
  useEffect(() => {
    async function subcategories() {
      const subResponse = await getSubcategories<ISubcategory>(
        `category=${categoryField}`
      );
      setSubcategories(subResponse.subcategories || []);
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

  // 2. Define a submit handler.
  async function onSubmit(values: ProductFormSchemaType) {
    try {
      const isUpdateSession = !!data?._id;
      const response = await upsertProduct({
        ...values,
        productId: data?._id!.toString(),
        variantId: variant?._id?.toString() // variant might not exist on first
      });

      toast({
        title: "Congratulations!",
        description: isUpdateSession
          ? `Your product ${response.product.name} and variant ${response.product.variants[0].variantName} has been updated successfully`
          : `Your product ${response.product.name} and variant ${response.product.variants[0].variantName} has been created successfully`
      });
    } catch (error: any) {
      console.log(error);
      toast({
        title: "An Error Occurred",
        description:
          error.response?.data.message ||
          "An unexpected error occured in the server while creating or updating",
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
              {/* TABBED DESCRIPTION FOR PRODUCT AND VARIANT WITH EDITOR */}
              <Tabs defaultValue="product" className="w-full">
                <TabsList className="grid grid-cols-2 mb-4">
                  <TabsTrigger value="product">Product Description</TabsTrigger>
                  <TabsTrigger value="variant">Variant Description</TabsTrigger>
                </TabsList>
                <TabsContent value="product">
                  <FormField
                    control={form.control}
                    name="description"
                    render={() => (
                      <FormItem className={"dark:bg-gray-500 dark:text-gray-900"}>
                        <FormControl>
                          <JoditEditor
                            ref={productDescEditor}
                            value={form.getValues("description")}
                            config={{
                              placeholder: "Describe your product"
                            }}
                            onBlur={(content) => {
                              form.setValue("description", content);
                            }}
                            // onChange={handleChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </TabsContent>
                <TabsContent value="variant">
                  <FormField
                    control={form.control}
                    name="variantDescription"
                    render={() => (
                      <FormItem className={"dark:bg-gray-500 dark:text-gray-900"}>
                        <FormControl>
                          <JoditEditor
                            ref={variantDescEditor}
                            value={form.getValues("variantDescription")}
                            config={{
                              placeholder: "Describe your variant"
                            }}
                            onBlur={(content) => {
                              form.setValue("variantDescription", content);
                            }}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </TabsContent>
                {errors.description && (
                  <p className="text-sm font-medium text-destructive">
                    {errors.description.message}
                  </p>
                )}
                {errors.variantDescription && (
                  <p className="text-sm font-medium text-destructive">
                    {errors.variantDescription.message}
                  </p>
                )}
              </Tabs>
              {/* CATEGORIES AND SUBCATEGORIES */}
              <div className="flex flex-col justify-between lg:flex-row gap-6">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => {
                    return (
                      <FormItem className="flex-1 justify-self-end">
                        <FormLabel>Select Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                        <FormMessage />
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
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                )}
              </div>
              {/* OFFER TAG FOR PRODUCT*/}
              <FormField
                control={form.control}
                name="offerTagId"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Product Offer tag</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            defaultValue={field.value}
                            placeholder="Select an offer tag"
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {offerTags &&
                          offerTags.map((offer) => (
                            <SelectItem
                              key={offer._id.toString()}
                              value={offer._id.toString()}
                            >
                              {offer.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* BRAND, SKU & WEIGHT OF PRODUCT */}
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
                <FormField
                  disabled={isSubmitting}
                  control={form.control}
                  name="weight"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Product weight</FormLabel>
                      <FormControl>
                        <NumberInput
                          defaultValue={field.value}
                          onValueChange={field.onChange}
                          placeholder="Weight"
                          min={0.01}
                          step={0.01}
                          className="!shadow-none rounded-md !text-sm"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {/* VARIANT IMAGE */}
              <FormField
                control={form.control}
                name="variantImage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Variant Image</FormLabel>
                    <FormControl>
                      <ImageUpload
                        showPreview={false}
                        type="profile"
                        value={field.value.map((image) => image.url)}
                        onChange={(url) => field.onChange([{ url }])}
                        onRemove={(url) =>
                          field.onChange([
                            ...field.value.filter((current) => current.url !== url)
                          ])
                        }
                      />
                    </FormControl>
                    <FormMessage className="!mt-4" />
                  </FormItem>
                )}
              />
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
                          autofocus={false}
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
                  header="VariantSize | Quantity | Price | Discount"
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
              {/* TABBED SPECIFICATIONS FOR PRODUCT AND VARIANT */}
              <Tabs defaultValue="product" className="w-full">
                <TabsList className="grid grid-cols-2 mb-4">
                  <TabsTrigger value="product">Product Specification</TabsTrigger>
                  <TabsTrigger value="variant">Variant Specification</TabsTrigger>
                </TabsList>
                <TabsContent value="product">
                  <AddInput
                    initialInputDetail={{ name: "", value: "" }}
                    inputDetails={productSpecs}
                    setInputDetails={setProductSpecs}
                    header="Add specifications"
                  />
                </TabsContent>
                <TabsContent value="variant">
                  <AddInput
                    initialInputDetail={{ name: "", value: "" }}
                    inputDetails={variantSpecs}
                    setInputDetails={setVariantSpecs}
                    header="Add specifications"
                  />
                </TabsContent>
                {errors.productSpecs && (
                  <p className="text-sm font-medium text-destructive">
                    {errors.productSpecs.message}
                  </p>
                )}
                {errors.variantSpecs && (
                  <p className="text-sm font-medium text-destructive">
                    {errors.variantSpecs.message}
                  </p>
                )}
              </Tabs>
              {/* SIZES*/}
              <div className="w-full flex flex-col gap-y-3">
                <AddInput
                  initialInputDetail={{ question: "", answer: "" }}
                  inputDetails={questions}
                  setInputDetails={setQuestions}
                  header="Common Q & A"
                />
                {errors.questions && (
                  <span className="text-sm font-medium text-destructive">
                    {errors.questions.message}
                  </span>
                )}
              </div>
              {/* SALE STATUS AND SALE END DATE */}
              <div className="grid grid-cols-2 border rounded-md p-4 px-4">
                <FormField
                  control={form.control}
                  name="isSale"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex gap-2 items-center">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel>On Sale</FormLabel>
                      </div>
                      <FormDescription>Is this product on sale?</FormDescription>
                    </FormItem>
                  )}
                />
                {form.getValues("isSale") && (
                  <FormField
                    control={form.control}
                    name="saleEndDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <DateTimePicker
                            className={"dark:bg-gray-100 dark:text-gray-900"}
                            onChange={(date) => {
                              field.onChange(
                                date ? format(date, "yyyy-MM-dd'T'HH:mm:ss") : ""
                              );
                            }}
                            value={field.value ? new Date(field.value) : null}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                )}
              </div>

              {
                <Button
                  type="submit"
                  className={cn({ "animate-pulse": isSubmitting })}
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? "Submitting..."
                    : data?._id
                      ? "Save Product"
                      : "Create Product"}
                </Button>
              }
            </form>
          </Form>
        </CardContent>
      </Card>
    </AlertDialog>
  );
}
