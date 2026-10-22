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
import { MultiSelect } from "react-multi-select-component";

// HOOKS, UTILITY FUNCTIONS & TYPES
import { useToast } from "@/hooks/use-toast";
import { ProductFormSchema, ProductFormSchemaType } from "@/lib/schemas";
import { ProductWithVariant } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ICategory } from "@/models/Category";
import { IProduct, IProductVariant } from "@/models/Product";
import { ISubcategory } from "@/models/Subcategory";
import { getSubcategories } from "@/queries/subcategory";
import { format } from "date-fns";
import { useEffect, useMemo, useRef, useState } from "react";
import { WithOutContext as ReactTags } from "react-tag-input";

// UITILITY UI COMPOENENTS
import DateTimePicker from "react-datetime-picker";

import "react-calendar/dist/Calendar.css";
import "react-clock/dist/Clock.css";
import "react-datetime-picker/dist/DateTimePicker.css";

import { IOfferTag } from "@/models/OfferTag";
import { ICountry, IFreeShipping } from "@/models/Shipping-Rate";
import { upsertProduct } from "@/services/product";
import { NumberInput } from "@tremor/react";
import JoditEditor from "jodit-react";
import { ArrowRight, Dot, Info } from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import ImagePreviewGrid from "../shared/image-preview-grid";
import ImageUpload from "../shared/image-upload";
import InputFieldset from "../shared/input-fieldset";
import AddInput from "./add-input";

interface ProductDetailsProps {
  data?: Partial<
    Omit<ProductWithVariant, "freeShipping"> & { freeShipping: IFreeShipping }
  >;
  categories: ICategory[];
  offerTags: IOfferTag[];
  countries: ICountry[];
  storeUrl: string;
}

interface Keyword {
  id: string;
  text: string;
}

const defaultImages = [
  {
    url: "https://res.cloudinary.com/dxgghtydz/image/upload/v1792428979/tubmfxczfqq5wyz7unka.avif"
  },
  {
    url: "https://res.cloudinary.com/dxgghtydz/image/upload/v1792428980/dgq8uqycs1yg3qulk0ux.avif"
  },
  {
    url: "https://res.cloudinary.com/dxgghtydz/image/upload/v1792428979/a4ah0hfddfeep81wisrz.avif"
  },
  {
    url: "https://res.cloudinary.com/dxgghtydz/image/upload/v1792428979/dhqu8yvleo318gdnxdm1.avif"
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

const shippingFeeMethods: {
  value: IProduct["shippingFeeMethod"];
  description: string;
}[] = [
  {
    value: "ITEM",
    // value: ShippingFeeMethod.ITEM,
    description: "ITEM (Fees calculated based on number of products.)"
  },
  {
    value: "WEIGHT",
    // value: ShippingFeeMethod.WEIGHT,
    description: "WEIGHT (Fees calculated based on product weight)"
  },
  {
    value: "FIXED",
    // value: ShippingFeeMethod.FIXED,
    description: "FIXED (Fees are fixed.)"
  }
];

export default function ProductDetails({
  data,
  categories,
  offerTags,
  countries = [],
  storeUrl
}: ProductDetailsProps) {
  const { toast } = useToast();
  const router = useRouter();

  // JODIT EDITOR & CONFIG
  const productDescEditor = useRef(null);
  const variantDescEditor = useRef(null);

  // Jodit configuration
  const { theme } = useTheme();

  // using memo to preserve the state and prevent re-rendering while value change in jodit
  const config = useMemo(() => {
    return { theme: theme === "dark" ? "dark" : "default" };
  }, [theme]);

  const variant = data?.variants && (data.variants[0] as IProductVariant);
  // Is new variant page
  const isNewVariantPage = Boolean(data?._id && !variant?._id);
  console.log("FreeShipping>>", data?.freeShipping);
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

  //Countries options
  type CountryOption = {
    label: string;
    value: string;
  };

  const countryOptions: CountryOption[] = countries.map((c) => ({
    label: c.name,
    value: c._id
  }));

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
      category: data?.category,
      subcategory: data?.subcategory,
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
      offerTagId: data?.offerTag || "",
      shippingFeeMethod: data?.shippingFeeMethod,
      freeShippingForAllCountries: data?.freeShippingForAllCountries,
      freeShippingCountriesIds: data?.freeShipping?._id
        ? countryOptions.filter((country) =>
            data.freeShipping!.eligibleCountries.includes(country.value)
          )
        : []
    }
  });

  const { reset } = form;
  const { isSubmitting, isSubmitSuccessful, errors } = form.formState;
  const {
    saleEndDate,
    isSale,
    freeShippingCountriesIds,
    description,
    variantDescription,
    category
  } = form.getValues();

  // Format sale end date
  const formattedDate = new Date(saleEndDate || new Date().toISOString()).toLocaleString(
    "en-Us",
    {
      weekday: "short", // Abbreviated day name (e.g., "Mon")
      month: "long", // Abbreviated month name (e.g., "Nov")
      day: "2-digit", // Two-digit day (e.g., "25")
      year: "numeric", // Full year (e.g., "2024")
      hour: "2-digit", // Two-digit hour (e.g., "02")
      minute: "2-digit", // Two-digit minute (e.g., "30")
      second: "2-digit", // Two-digit second (optional)
      hour12: false // 12-hour format (change to false for 24-hour format)
    }
  );

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
  const isfreeShippingForAllCountries = form.watch("freeShippingForAllCountries");
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
      console.log("values>>", values);
      console.log("FreeShipping>>", data?.freeShipping);
      await upsertProduct(
        {
          ...values,
          productId: data?._id,
          variantId: variant?._id, // variant might not exist on first
          productSlug: data?.slug,
          variantSlug: variant?.slug
        },
        storeUrl
      );

      toast({
        title: "Congratulations!",
        description: isUpdateSession
          ? `Your product and variant have been updated successfully`
          : `Your product and variant have been created successfully`
      });
    } catch (error: any) {
      toast({
        title: "An Error Occurred",
        description: error.message,
        variant: "destructive"
      });
    }
  }

  const handleDeleteCountryFreeShipping = (index: number) => {
    const updatedValues = freeShippingCountriesIds.filter((_, i) => i !== index);
    form.setValue("freeShippingCountriesIds", updatedValues);
  };

  return (
    <AlertDialog>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>
            {isNewVariantPage
              ? `Add a new variant to ${data?.name}`
              : "Create a new product"}
          </CardTitle>
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
                            images={form.getValues("images")}
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
              <InputFieldset label="Name">
                <div className="flex flex-col lg:flex-row gap-4">
                  {!isNewVariantPage && (
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input placeholder="Product name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  <FormField
                    control={form.control}
                    name="variantName"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input placeholder="Variant name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </InputFieldset>
              {/* TABBED DESCRIPTION FOR PRODUCT AND VARIANT WITH EDITOR */}
              <InputFieldset
                label="Description"
                description={
                  isNewVariantPage
                    ? ""
                    : "Note: The product description is the main description for the product (Will display in every variant page). You can add an extra description specific to this variant using 'Variant description' tab."
                }
              >
                <Tabs
                  defaultValue={isNewVariantPage ? "variant" : "product"}
                  className="w-full"
                >
                  {!isNewVariantPage && (
                    <TabsList className="w-full grid grid-cols-2">
                      <TabsTrigger value="product">Product description</TabsTrigger>
                      <TabsTrigger value="variant">Variant description</TabsTrigger>
                    </TabsList>
                  )}
                  <TabsContent value="product">
                    <FormField
                      control={form.control}
                      name="description"
                      render={() => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <JoditEditor
                              ref={productDescEditor}
                              config={config}
                              value={description}
                              onBlur={(content) => {
                                form.setValue("description", content);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TabsContent>
                  <TabsContent value="variant">
                    <FormField
                      control={form.control}
                      name="variantDescription"
                      render={() => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <JoditEditor
                              ref={variantDescEditor}
                              config={config}
                              value={variantDescription}
                              onBlur={(content) => {
                                form.setValue("variantDescription", content);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TabsContent>
                </Tabs>
              </InputFieldset>

              {/* CATEGORIES - SUBCATEGORIES & OFFER */}
              {!isNewVariantPage && (
                <InputFieldset label="Category">
                  <div className="flex gap-4">
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <Select
                            disabled={categories.length == 0}
                            onValueChange={field.onChange}
                            value={field.value}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue
                                  defaultValue={field.value}
                                  placeholder="Select a category"
                                />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {categories.map((category) => (
                                <SelectItem key={category._id} value={category._id}>
                                  {category.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="subcategory"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <Select
                            disabled={categories.length == 0 || !category}
                            onValueChange={field.onChange}
                            value={field.value}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue
                                  defaultValue={field.value}
                                  placeholder="Select a sub-category"
                                />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {subcategories.map((sub) => (
                                <SelectItem key={sub._id} value={sub._id}>
                                  {sub.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/* Offer Tag */}
                    <FormField
                      control={form.control}
                      name="offerTagId"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <Select
                            disabled={categories.length == 0}
                            onValueChange={field.onChange}
                            value={field.value}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue
                                  defaultValue={field.value}
                                  placeholder="Select an offer"
                                />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {offerTags &&
                                offerTags.map((offer) => (
                                  <SelectItem key={offer._id} value={offer._id}>
                                    {offer.name}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </InputFieldset>
              )}

              {/* BRAND, SKU & WEIGHT OF PRODUCT */}
              <InputFieldset
                label={isNewVariantPage ? "Sku, Weight" : "Brand, Sku, Weight"}
              >
                <div className="flex flex-col lg:flex-row gap-4">
                  {!isNewVariantPage && (
                    <FormField
                      control={form.control}
                      name="brand"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input placeholder="Product brand" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  <FormField
                    control={form.control}
                    name="sku"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input placeholder="Product sku" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="weight"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <NumberInput
                            defaultValue={field.value}
                            onValueChange={field.onChange}
                            placeholder="Product weight"
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
              </InputFieldset>

              {/* VARIANT IMAGE & KEYWORDS */}
              <div className="flex items-center gap-10 py-14">
                {/* IMAGE */}
                <div className="border-r pr-10">
                  <FormField
                    control={form.control}
                    name="variantImage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="ml-14">Variant Image</FormLabel>
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
                </div>
                {/* Keywords */}
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
                      </FormItem>
                    )}
                  />
                  <div className="flex flex-wrap gap-1">
                    {keywords.map((k, i) => (
                      <div
                        key={i}
                        className="text-xs inline-flex items-center px-3 py-1 bg-primary-light text-card-foreground rounded-full gap-x-2"
                      >
                        <span>{k}</span>
                        <span
                          className="cursor-pointer"
                          onClick={() => handleDeleteKeyword(i)}
                        >
                          x
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* SIZES*/}
              <InputFieldset label="Provide variant options">
                <div className="w-full flex flex-col gap-y-3">
                  <AddInput
                    initialInputDetail={{ size: "", quantity: 0, price: 0, discount: 0 }}
                    inputDetails={sizes}
                    setInputDetails={setSizes}
                    header="Variant / Size | Quantity | Price | Discount"
                    containerClassName="flex-1"
                    inputClassName="w-full"
                  />
                  {errors.sizes && (
                    <span className="text-sm font-medium text-destructive">
                      {errors.sizes.message}
                    </span>
                  )}
                </div>
              </InputFieldset>

              {/* SPECIFICATOIN FOR PRODUCT & VARIANT */}
              <InputFieldset
                label="Specifications"
                description={
                  isNewVariantPage
                    ? ""
                    : "Note: The product specifications are the main specs for the product (Will display in every variant page). You can add extra specs specific to this variant using 'Variant Specifications' tab."
                }
              >
                <Tabs
                  defaultValue={isNewVariantPage ? "variantSpecs" : "productSpecs"}
                  className="w-full"
                >
                  {!isNewVariantPage && (
                    <TabsList className="w-full grid grid-cols-2">
                      <TabsTrigger value="productSpecs">
                        Product Specifications
                      </TabsTrigger>
                      <TabsTrigger value="variantSpecs">
                        Variant Specifications
                      </TabsTrigger>
                    </TabsList>
                  )}
                  <TabsContent value="productSpecs">
                    <div className="w-full flex flex-col gap-y-3">
                      <AddInput
                        inputDetails={productSpecs}
                        setInputDetails={setProductSpecs}
                        initialInputDetail={{ name: "", value: "" }}
                        containerClassName="flex-1"
                        inputClassName="w-full"
                      />
                      {errors.productSpecs && (
                        <span className="text-sm font-medium text-destructive">
                          {errors.productSpecs.message}
                        </span>
                      )}
                    </div>
                  </TabsContent>
                  <TabsContent value="variantSpecs">
                    <div className="w-full flex flex-col gap-y-3">
                      <AddInput
                        inputDetails={variantSpecs}
                        setInputDetails={setVariantSpecs}
                        initialInputDetail={{
                          name: "",
                          value: ""
                        }}
                        containerClassName="flex-1"
                        inputClassName="w-full"
                      />
                      {errors.variantSpecs && (
                        <span className="text-sm font-medium text-destructive">
                          {errors.variantSpecs.message}
                        </span>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </InputFieldset>

              {/* QUESTIONS*/}
              {!isNewVariantPage && (
                <InputFieldset label="Questions & Answers">
                  <div className="w-full flex flex-col gap-y-3">
                    <AddInput
                      inputDetails={questions}
                      setInputDetails={setQuestions}
                      initialInputDetail={{
                        question: "",
                        answer: ""
                      }}
                      containerClassName="flex-1"
                      inputClassName="w-full"
                    />
                    {errors.questions && (
                      <span className="text-sm font-medium text-destructive">
                        {errors.questions.message}
                      </span>
                    )}
                  </div>
                </InputFieldset>
              )}
              {/* SALE STATUS AND SALE END DATE */}
              <InputFieldset label="Sale" description="Is your product on sale ?">
                <div>
                  <label
                    htmlFor="saleCheckBox"
                    className="ml-5 flex items-center gap-x-2 cursor-pointer"
                  >
                    <FormField
                      control={form.control}
                      name="isSale"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <>
                              <input
                                type="checkbox"
                                id="saleCheckBox"
                                checked={field.value}
                                onChange={field.onChange}
                                hidden
                              />
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <span>Yes</span>
                  </label>
                  {isSale && (
                    <div className="mt-5">
                      <p className="text-sm text-muted-foreground pb-3 flex">
                        <Dot className="-me-1" />
                        When sale does end ?
                      </p>
                      <div className="flex items-center gap-x-5">
                        <FormField
                          control={form.control}
                          name="saleEndDate"
                          render={({ field }) => (
                            <FormItem className="ml-4">
                              <FormControl>
                                <DateTimePicker
                                  className="inline-flex items-center gap-2 p-2 border rounded-md shadow-sm"
                                  calendarIcon={
                                    <span className="text-muted-foreground hover:text-muted">
                                      📅
                                    </span>
                                  }
                                  clearIcon={
                                    <span className="text-muted-foreground hover:text-muted">
                                      ✖️
                                    </span>
                                  }
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
                        <ArrowRight className="w-4 text-primary-mid" />
                        <span>{formattedDate}</span>
                      </div>
                    </div>
                  )}
                </div>
              </InputFieldset>

              {/* Shipping fee method */}
              {!isNewVariantPage && (
                <InputFieldset label="Product shipping fee method">
                  <FormField
                    // disabled={isLoading}
                    control={form.control}
                    name="shippingFeeMethod"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <Select
                          // disabled={isLoading}
                          onValueChange={field.onChange}
                          value={field.value}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue
                                defaultValue={field.value}
                                placeholder="Select Shipping Fee Calculation method"
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {shippingFeeMethods.map((method) => (
                              <SelectItem key={method.value} value={method.value}>
                                {method.description}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </InputFieldset>
              )}

              {/* Free Shipping */}
              {!isNewVariantPage && (
                <InputFieldset
                  label="Free Shipping (Optional)"
                  description="Free Shipping Worldwide ?"
                >
                  <div>
                    <label
                      htmlFor="freeShippingForAll"
                      className="ml-5 flex items-center gap-x-2 cursor-pointer"
                    >
                      <FormField
                        control={form.control}
                        name="freeShippingForAllCountries"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <>
                                <input
                                  type="checkbox"
                                  id="freeShippingForAll"
                                  checked={field.value}
                                  onChange={field.onChange}
                                  hidden
                                />
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </>
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <span>Yes</span>
                    </label>
                  </div>
                  <div>
                    <p className="mt-4 text-sm text-muted-foreground pb-3 flex">
                      <Info className="mr-1 size-5 flex-shrink-0" />
                      <span>
                        If not select the countries you want to ship this product to for
                        free
                      </span>
                    </p>
                  </div>
                  <div>
                    {!isfreeShippingForAllCountries && (
                      <div>
                        <FormField
                          control={form.control}
                          name="freeShippingCountriesIds"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <MultiSelect
                                  className="!max-w-[800px]"
                                  options={countryOptions} // Array of options, each with `label` and `value`
                                  value={field.value} // Pass the array of objects directly
                                  onChange={(selected: CountryOption[]) => {
                                    field.onChange(selected);
                                  }}
                                  labelledBy="Select"
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <p className="mt-4 text-sm text-muted-foreground pb-3 flex">
                          <Dot className="-me-1" />
                          List of countries you offer free shipping for this product
                          :&nbsp;
                          {freeShippingCountriesIds &&
                            freeShippingCountriesIds.length === 0 &&
                            "None"}
                        </p>
                        {/* Free shipping countries */}
                        <div className="flex flex-wrap gap-1">
                          {form
                            .watch("freeShippingCountriesIds")
                            ?.map((country, index) => (
                              <div
                                key={index}
                                className="text-xs inline-flex items-center px-3 py-1 bg-primary-light text-card-foreground rounded-md gap-x-2"
                              >
                                <span>{country.label}</span>
                                <span
                                  className="cursor-pointer hover:text-destructive"
                                  onClick={() => handleDeleteCountryFreeShipping(index)}
                                >
                                  x
                                </span>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                </InputFieldset>
              )}

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
            </form>
          </Form>
        </CardContent>
      </Card>
    </AlertDialog>
  );
}
