import z from "zod";

export const UserFormSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters."
  }),
  email: z.email("Email is required"),
  password: z
    .string()
    .min(8, "Passoword should be at least 8 characters long")
    .max(24, "Password should not exceed 24 characters"),
  name: z
    .string()
    .max(50, "Name is too long")
    .regex(/^[\s\w]+$/, "Name should not contain any special characters")
    .trim()
});

export const CategoryFormSchema = z.object({
  name: z
    .string({
      error: "Category name is required."
    })
    .min(2, { error: "Category name must be at least 2 characters long." })
    .max(50, { error: "Category name cannot exceed 50 characters." })
    // .regex(/^(?!.*__)(?!.*--)[a-zA-Z0-9_\-\s]+$/, {
    .regex(/^(?!.*[ _-]{2})[A-Za-z0-9]+(?:[ _-][A-Za-z0-9]+)*$/, {
      error:
        "Only alphanumeric characters and only one separator like space( ), underscore(_), hyphen(-) between words are allowed. Also starting or ending with separators not allowed."
    }),
  image: z
    .object({
      url: z.string()
    })
    .array()
    .length(1, "Choose an image for category."),
  // image: z.string(),
  url: z
    .string({
      error: "Category url is required"
    })
    .min(2, { error: "Category url must be at least 2 characters long." })
    .max(50, { error: "Category url cannot exceed 50 characters." })
    .regex(/^(?!.*(?:[-_ ]){2,})[a-zA-Z0-9_ -]+$/, {
      error:
        "Only letters, numbers, space, hyphen, and underscore are allowed in the url and consecutive occurrences of hyphens, underscores, or spaces are not permitted."
    }),
  // .regex(/^(?!.*(?:[-_ ]){2,})[a-zA-Z0-9_-]+$/, {
  //   error:
  //     "Only letters, numbers, hyphen, and underscore are allowed in the category url, and consecutive occurrences of hyphens, underscores, or spaces are not permitted."
  // }),
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
        "Only alphanumeric characters and only one separator like space( ), underscore(_), hyphen(-) between words are allowed. Also starting or ending with separators not allowed."
    }),
  image: z
    .object({
      url: z.string()
    })
    .array()
    .length(1, "Choose an image for Subcategory."),
  // image: z.string(),
  url: z
    .string("Store url is required")
    .min(2, { error: "Subcategory url must be at least 2 characters long." })
    .max(50, { error: "Subcategory url cannot exceed 50 characters." })
    .regex(/^(?!.*(?:[-_ ]){2,})[a-zA-Z0-9_-]+$/, {
      error:
        "Only letters, numbers, hyphen, and underscore are allowed in the url, and consecutive occurrences of hyphens, underscores, or spaces are not permitted."
    }),
  featured: z.boolean(),
  // category: z.custom<mongoose.Types.ObjectId>(
  //   (val) => typeof val === mongoose.Types.ObjectId.toString(),
  //   { error: "Category ID is required for creating subcategory" }
  // )
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
    // .regex(/^(?!.*[ _-]{2})[A-Za-z0-9]+(?:[ _-][A-Za-z0-9]+)*$/,
    .regex(/^(?!.*(?:[-_ ]){2,})[a-zA-Z0-9_ -]+$/, {
      error:
        "Only letters, numbers, space, hyphen, and underscore are allowed in the store name, and consecutive occurrences of hyphens, underscores, or spaces are not permitted."
    }),
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
    .regex(/^(?!.*(?:[-_ ]){2,})[a-zA-Z0-9_-]+$/, {
      error:
        "Only letters, numbers, hyphen, and underscore are allowed in the store url, and consecutive occurrences of hyphens, underscores, or spaces are not permitted."
    }),
  logo: z.object({ url: z.string() }).array().length(1, "Choose a logo image."),
  cover: z.object({ url: z.string() }).array().length(1, "Choose a cover image."),
  featured: z.boolean()
  // status: z.string()
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
    .regex(/^(?!.*(?:[-_ ]){2,})[a-zA-Z0-9_ -]+$/, {
      error:
        "Product name may only contain letters, numbers, spaces, hyphens, and underscores, without consecutive special characters."
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
    .max(100, { error: "Product variant name cannot exceed 100 characters." })
    .regex(/^(?!.*(?:[-_ ]){2,})[a-zA-Z0-9_ -]+$/, {
      error:
        "Product variant name may only contain letters, numbers, spaces, hyphens, and underscores, without consecutive special characters."
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
  category: z.string({
    error: (issue) =>
      !issue.input
        ? "Product category ID is mandatory."
        : "Product category ID must be a valid UUID."
  }),
  subcategory: z.string({
    error: (issue) =>
      !issue.input
        ? "Product subcategory ID is mandatory."
        : "Product subcategory ID must be a valid UUID."
  }),
  // offerTagId: z
  //   .string({
  //     error: (issue) =>
  //       !issue.input
  //         ? "Product offer tag ID is mandatory."
  //         : "Product offer tag ID must be a valid UUID."
  //   })
  //   .uuid(),
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
  // product_specs: z
  //   .object({
  //     name: z.string(),
  //     value: z.string()
  //   })
  //   .array()
  //   .min(1, "Please provide at least one product spec.")
  //   .refine(
  //     (product_specs) =>
  //       product_specs.every((s) => s.name.length > 0 && s.value.length > 0),
  //     {
  //       error: "All product specs inputs must be filled correctly."
  //     }
  //   ),
  // variant_specs: z
  //   .object({
  //     name: z.string(),
  //     value: z.string()
  //   })
  //   .array()
  //   .min(1, "Please provide at least one product variant spec.")
  //   .refine(
  //     (product_specs) =>
  //       product_specs.every((s) => s.name.length > 0 && s.value.length > 0),
  //     {
  //       error: "All product variant specs inputs must be filled correctly."
  //     }
  //   ),
  // questions: z
  //   .object({
  //     question: z.string(),
  //     answer: z.string()
  //   })
  //   .array()
  //   .min(1, "Please provide at least one product question.")
  //   .refine(
  //     (questions) =>
  //       questions.every((q) => q.question.length > 0 && q.answer.length > 0),
  //     {
  //       error: "All product question inputs must be filled correctly."
  //     }
  //   ),
  isSale: z.boolean().default(false).nonoptional(),

  saleEndDate: z.string().optional()
});

export type UserFormSchemaType = z.infer<typeof UserFormSchema>;
export type CategoryFormSchemaType = z.infer<typeof CategoryFormSchema>;
export type SubcategoryFormSchemaType = z.infer<typeof SubcategoryFormSchema>;
export type StoreFormSchemaType = z.infer<typeof StoreFormSchema>;
export type ProductFormSchemaType = z.infer<typeof ProductFormSchema>;
