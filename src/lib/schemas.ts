import z from "zod";

export const UserFormSchema = z.object({
  username: z
    .string({
      error: (iss) =>
        iss.input === undefined ? "Username is required" : "Invalid username"
    })
    .min(2, {
      message: "Username must be at least 2 characters."
    })
    .regex(/^(?!.*[_-]{2})[A-Za-z0-9]+(?:[_-][A-Za-z0-9]+)*$/, {
      error:
        "Only allowed alphanumerics and special characters like: (_ -). Not allowed special characters at the beginning or end and consecutive occurances between words."
    }),
  email: z.email("Email is required"),
  password: z
    .string()
    .min(8, "Passoword should be at least 8 characters long")
    .max(24, "Password should not exceed 24 characters"),
  name: z
    .string()
    .max(50, "Name is too long")
    .regex(
      /^(?:[a-zA-Z]+ |[a-zA-Z]+\.|[a-zA-Z]+\. )*[a-zA-Z]+$/,
      "Not allowed special characters and spaces at the beginning or end or multiple spaces between words. Only allowed alphabets and (.) as special character."
    )
    .trim()
});

export const CategoryFormSchema = z.object({
  name: z
    .string({
      error: "Category name is required."
    })
    .min(2, { error: "Category name must be at least 2 characters long." })
    .max(50, { error: "Category name cannot exceed 50 characters." })
    .regex(/^(?!.*[ _-]{2})[A-Za-z0-9]+(?:[ _-][A-Za-z0-9]+)*$/, {
      error:
        "Only allowed alphanumerics and special characters like: (space _ -). Not allowed special characters at the beginning or end and consecutive occurances between words."
    }),
  image: z
    .object({
      url: z.string()
    })
    .array()
    .length(1, "Choose an image for category."),
  url: z
    .string({
      error: "Category url is required"
    })
    .min(2, { error: "Category url must be at least 2 characters long." })
    .max(50, { error: "Category url cannot exceed 50 characters." })
    .regex(/^(?!.*[ _-]{2})[A-Za-z0-9]+(?:[ _-][A-Za-z0-9]+)*$/, {
      error:
        "Only allowed alphanumerics and special characters like: (space _ -). Not allowed special characters at the beginning or end and consecutive occurances between words."
    }),
  featured: z.boolean() //   // adding default doesn't work in form resolver
});

export const SubcategoryFormSchema = z.object({
  name: z
    .string({
      error: "Subcategory name is required."
    })
    .min(2, { error: "Subcategory name must be at least 2 characters long." })
    .max(50, { error: "Subcategory name cannot exceed 50 characters." })
    .regex(/^(?!.*[ _-]{2})[A-Za-z0-9]+(?:[ _-][A-Za-z0-9]+)*$/, {
      error:
        "Only allowed alphanumerics and special characters like: (space _ -). Not allowed special characters at the beginning or end and consecutive occurances between words."
    }),
  image: z
    .object({
      url: z.string()
    })
    .array()
    .length(1, "Choose an image for Subcategory."),
  url: z
    .string("Store url is required")
    .min(2, { error: "Subcategory url must be at least 2 characters long." })
    .max(50, { error: "Subcategory url cannot exceed 50 characters." })
    .regex(/^(?!.*[ _-]{2})[A-Za-z0-9]+(?:[ _-][A-Za-z0-9]+)*$/, {
      error:
        "Only allowed alphanumerics and special characters like: (space _ -). Not allowed special characters at the beginning or end and consecutive occurances between words."
    }),
  featured: z.boolean(),
  category: z.string("Category ID is required for creating subcategory").nonoptional()
});

export const StoreFormSchema = z.object({
  name: z
    .string({
      error: (iss) =>
        iss.input === undefined ? "Store name is required." : "Invalid store name"
    })
    .min(2, { error: "Store name must be at least 2 characters long." })
    .max(50, { error: "Store name cannot exceed 50 characters." })
    .regex(
      /^(?!.*[ _-]{2})[A-Za-z0-9]+(?:[_-][A-Za-z0-9]+| [A-Za-z0-9]+| [&$] [A-Za-z0-9]+)*$/,
      {
        error:
          "Only allowed aphanumerics and special characters like: (space-_$&). Not allowed special characters or spaces at the beginning or end and consecutive occurances between words. There must be space between words and special character"
      }
    ),
  description: z
    .string("Descirption is required")
    .min(10, "Description should be at least 10 characters")
    .max(1000, "Description should not exceed 1000 characters"),
  email: z.string("Email is required").email("Please provide a valid email"),
  phone: z
    .string("Phone number for store is required")
    .regex(/^(\+88)?[0-9]{11}$/, "Please provide a valid phone number"),
  url: z
    .string("Store url is required")
    .min(2, { error: "Store url must be at least 2 characters long." })
    .max(50, { error: "Store url cannot exceed 50 characters." })
    .regex(/^(?!.*[ _-]{2})[A-Za-z0-9]+(?:[ _-][A-Za-z0-9]+)*$/, {
      error:
        "Only allowed alphanumerics and special characters like: (space _ -). Not allowed special characters at the beginning or end and consecutive occurances between words."
    }),
  logo: z.object({ url: z.string() }).array().length(1, "Choose a logo image."),
  cover: z.object({ url: z.string() }).array().length(1, "Choose a cover image."),
  featured: z.boolean()
});

export const ProductFormSchema = z.object({
  name: z
    .string({
      error: (issue) =>
        !issue.input
          ? "Product name is mandatory."
          : "Product name must be a valid string."
    })
    .min(2, { error: "Product name should be at least 2 characters long." })
    .max(200, { error: "Product name cannot exceed 200 characters." })
    .regex(/^(?!.*[  ]{2})[A-Za-z0-9]+(?: [A-Za-z0-9]+| [-_&$] [A-Za-z0-9]+)*$/, {
      error:
        "Only allowed aphanumerics and special characters like: (space-_$&). Not allowed special characters or spaces at the beginning or end and consecutive occurances between words. There must be space between words and special character"
    }),
  description: z
    .string({
      error: (issue) =>
        !issue.input
          ? "Product description is mandatory."
          : "Product description must be a valid string."
    })
    .min(200, {
      error: "Product description should be at least 200 characters long."
    }),
  variantName: z
    .string({
      error: (issue) =>
        !issue.input
          ? "Product variant name is mandatory."
          : "Product variant name must be a valid string."
    })
    .min(2, {
      error: "Product variant name should be at least 2 characters long."
    })
    .max(200, { error: "Product variant name cannot exceed 200 characters." })
    .regex(/^(?!.*[  ]{2})[A-Za-z0-9]+(?: [A-Za-z0-9]+| [-_&$] [A-Za-z0-9]+)*$/, {
      error:
        "Only allowed aphanumerics and special characters like: (space-_$&). Not allowed special characters or spaces at the beginning or end and consecutive occurances between words. There must be space between words and special character"
    }),
  variantDescription: z
    .string({
      error: (issue) =>
        !issue.input
          ? "Product variant description is mandatory."
          : "Product variant description must be a valid string."
    })
    .optional(),
  images: z
    .object({ url: z.string() })
    .array()
    .min(3, "Please upload at least 3 images for the product.")
    .max(6, "You can upload up to 6 images for the product."),
  variantImage: z
    .object({ url: z.string() })
    .array()
    .length(1, "Choose a product variant image."),
  productId: z.string().optional(),
  variantId: z.string().optional(),
  storeUrl: z.string(),
  category: z.string({
    error: (issue) =>
      !issue.input
        ? "Product category ID is mandatory."
        : "Product category ID must be a valid string ObjectId."
  }),
  subcategory: z.string({
    error: (issue) =>
      !issue.input
        ? "Product subcategory ID is mandatory."
        : "Product subcategory ID must be a valid string ObjectId."
  }),
  offerTagId: z.string({
    error: (issue) =>
      !issue.input
        ? "Product offer tag ID is mandatory."
        : "Product offer tag ID must be a valid string ObjectId."
  }),
  brand: z
    .string({
      error: (issue) =>
        !issue.input
          ? "Product brand is mandatory."
          : "Product brand must be a valid string."
    })
    .min(2, {
      error: "Product brand should be at least 2 characters long."
    })
    .max(50, {
      error: "Product brand cannot exceed 50 characters."
    }),
  sku: z
    .string({
      error: (issue) =>
        !issue.input ? "Product SKU is mandatory." : "Product SKU must be a valid string."
    })
    .min(6, {
      error: "Product SKU should be at least 6 characters long."
    })
    .max(50, {
      error: "Product SKU cannot exceed 50 characters."
    }),
  weight: z.number({ message: "Must be a numeric value" }),
  keywords: z
    .string({
      error: (issue) =>
        !issue.input
          ? "Product keywords are mandatory."
          : "Keywords must be valid strings."
    })
    .array()
    .min(5, {
      error: "Please provide at least 5 keywords."
    })
    .max(10, {
      error: "You can provide up to 10 keywords."
    }),
  colors: z
    .object({ color: z.string() })
    .array()
    .min(1, "Please provide at least one color.")
    .refine((colors) => colors.every((c) => c.color.length > 0), {
      error: "All color inputs must be filled."
    }),
  sizes: z
    .object({
      size: z.string({ message: "Must be a text or string" }),
      quantity: z
        .number({ message: "Must be a number" })
        .min(1, { message: "Quantity must be greater than 0." }),
      price: z
        .number({ message: "Must be a number" })
        .min(0.01, { message: "Price must be greater than 0." }),
      discount: z.number({ message: "Must be a number" }).min(0).default(0).nonoptional()
    })
    .array()
    .min(1, "Please provide at least one size.")
    .refine(
      (sizes) => sizes.every((s) => s.size.length > 0 && s.price > 0 && s.quantity > 0),
      {
        error: "All size inputs must be filled correctly."
      }
    ),
  productSpecs: z
    .object({
      name: z.string(),
      value: z.string()
    })
    .array()
    .min(1, "Please provide at least one product specification.")
    .refine((specs) => specs.every((spec) => spec.name && spec.value), {
      error: "All product specification inputs must be filled correctly."
    }),
  variantSpecs: z
    .object({
      name: z.string(),
      value: z.string()
    })
    .array()
    .min(1, "Please provide at least one product variant specification.")
    .refine((specs) => specs.every((spec) => spec.name && spec.value), {
      error: "All product variant specification inputs must be filled correctly."
    }),
  questions: z
    .object({
      question: z.string(),
      answer: z.string()
    })
    .array()
    .min(1, "Please provide at least one product question.")
    .refine(
      (questions) => questions.every((q) => q.question.length > 0 && q.answer.length > 0),
      {
        error: "All product question inputs must be filled correctly."
      }
    ),
  isSale: z.boolean().default(false).nonoptional(),
  saleEndDate: z.string().optional()
});

export const OfferTagFormSchema = z.object({
  name: z
    .string({
      error: (issue) =>
        !issue.input ? "Offer tag name is required." : "Offer tag name must be a string."
    })
    .min(2, { message: "Offer tag name must be at least 2 characters long." })
    .max(50, { message: "Offer tag name cannot exceed 50 characters." })
    .regex(/^[a-zA-Z0-9\s&$.%,']+$/, {
      message: "Only letters, numbers, and spaces are allowed in the offer tag name."
    }),
  url: z
    .string({
      error: (issue) =>
        !issue.input ? "Offer tag url is required" : "Offer tag url must be a string"
    })
    .min(2, { message: "Offer tag url must be at least 2 characters long." })
    .max(50, { message: "Offer tag url cannot exceed 50 characters." })
    .regex(/^(?!.*(?:[-_ ]){2,})[a-zA-Z0-9_-]+$/, {
      message:
        "Only letters, numbers, hyphen, and underscore are allowed in the offer tag url, and consecutive occurrences of hyphens, underscores, or spaces are not permitted."
    }),
  _id: z.string().optional()
});

export const StoreShippingFormSchema = z.object({
  defaultShippingService: z
    .string({
      error: (issue) =>
        !issue.input ? "Shipping service name is required." : "Invalid input value"
    })
    .min(2, "Shipping service name must be at least 2 characters long.")
    .max(50, { message: "Shipping service name cannot exceed 50 characters." }),
  defaultShippingFeePerItem: z.number(),
  defaultShippingFeeForAdditionalItem: z.number(),
  defaultShippingFeePerKg: z.number(),
  defaultShippingFeeFixed: z.number(),
  defaultDeliveryTimeMin: z.number(),
  defaultDeliveryTimeMax: z.number(),
  returnPolicy: z.string()
});

export const ShippingRateFormSchema = z.object({
  shippingService: z
    .string({
      error: (issue) =>
        !issue.input
          ? "Shipping service name is required."
          : "Shipping service name must be a string."
    })
    .max(50, { message: "Shipping service name cannot exceed 50 characters." }),
  countryName: z.string(),
  shippingFeePerItem: z.number(),
  shippingFeeForAdditionalItem: z.number(),
  shippingFeePerKg: z.number(),
  shippingFeeFixed: z.number(),
  deliveryTimeMin: z.number(),
  deliveryTimeMax: z.number(),
  returnPolicy: z
    .string({
      error: (issue) =>
        !issue.input ? "Return policy is required." : "Return policy must be a string."
    })
    .min(4, "Too short policy"),
  countryId: z.string()
});

// Add review schema
export const AddReviewSchema = z.object({
  variantName: z.string(),
  rating: z.number({
    error: "Please add a rating."
  }),
  size: z.string(),
  review: z.string()
});

export type UserFormSchemaType = z.infer<typeof UserFormSchema>;
export type CategoryFormSchemaType = z.infer<typeof CategoryFormSchema>;
export type SubcategoryFormSchemaType = z.infer<typeof SubcategoryFormSchema>;
export type StoreFormSchemaType = z.infer<typeof StoreFormSchema>;
export type ProductFormSchemaType = z.infer<typeof ProductFormSchema>;
export type OfferTagFormSchemaType = z.infer<typeof OfferTagFormSchema>;
export type StoreShippingFormSchemaType = z.infer<typeof StoreShippingFormSchema>;
export type ShippingRateFormSchemaType = z.infer<typeof ShippingRateFormSchema>;
export type AddReviewSchemaType = z.infer<typeof AddReviewSchema>;
