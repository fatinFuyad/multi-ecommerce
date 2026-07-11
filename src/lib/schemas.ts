import z from "zod";

export const CategoryFormSchema = z.object({
  name: z
    .string({
      error: "Category name is required."
    })
    .min(2, { message: "Category name must be at least 2 characters long." })
    .max(50, { message: "Category name cannot exceed 50 characters." })
    // .regex(/^(?!.*__)(?!.*--)[a-zA-Z0-9_\-\s]+$/, {
    .regex(/^(?!.*[ _-]{2})[A-Za-z0-9]+(?:[ _-][A-Za-z0-9]+)*$/, {
      message:
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
      message: "Category url is required"
    })
    .min(2, { message: "Category url must be at least 2 characters long." })
    .max(50, { message: "Category url cannot exceed 50 characters." })
    .regex(/^(?!.*(?:[-_ ]){2,})[a-zA-Z0-9_ -]+$/, {
      message:
        "Only letters, numbers, space, hyphen, and underscore are allowed in the url and consecutive occurrences of hyphens, underscores, or spaces are not permitted."
    }),
  // .regex(/^(?!.*(?:[-_ ]){2,})[a-zA-Z0-9_-]+$/, {
  //   error:
  //     "Only letters, numbers, hyphen, and underscore are allowed in the category url, and consecutive occurrences of hyphens, underscores, or spaces are not permitted."
  // }),
  featured: z.boolean() //   // adding default doesn't work in form resolver
});

// type CategoryForm = z.infer<typeof CategoryFormSchema>;

export const SubcategoryFormSchema = z.object({
  name: z
    .string({
      error: "Subcategory name is required."
    })
    .min(2, { message: "Subcategory name must be at least 2 characters long." })
    .max(50, { message: "Subcategory name cannot exceed 50 characters." })
    .regex(/^(?!.*[ _-]{2})[A-Za-z0-9]+(?:[ _-][A-Za-z0-9]+)*$/, {
      message:
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
    .min(2, { message: "Subcategory url must be at least 2 characters long." })
    .max(50, { message: "Subcategory url cannot exceed 50 characters." })
    .regex(/^(?!.*(?:[-_ ]){2,})[a-zA-Z0-9_-]+$/, {
      message:
        "Only letters, numbers, hyphen, and underscore are allowed in the url, and consecutive occurrences of hyphens, underscores, or spaces are not permitted."
    }),
  featured: z.boolean(),
  // category: z.custom<mongoose.Types.ObjectId>(
  //   (val) => typeof val === mongoose.Types.ObjectId.toString(),
  //   { message: "Category ID is required for creating subCateogy" }
  // )
  category: z
    .string("Category ID is required for creating subCateogy")
    .nonoptional()
});

export const StoreFormSchema = z.object({
  name: z
    .string({
      error: (iss) =>
        iss.input === undefined
          ? "Store name is required."
          : "Invalid store name"
    })
    .min(2, { message: "Store name must be at least 2 characters long." })
    .max(50, { message: "Store name cannot exceed 50 characters." })
    // .regex(/^(?!.*[ _-]{2})[A-Za-z0-9]+(?:[ _-][A-Za-z0-9]+)*$/,
    .regex(/^(?!.*(?:[-_ ]){2,})[a-zA-Z0-9_ -]+$/, {
      message:
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
    .min(2, { message: "Store url must be at least 2 characters long." })
    .max(50, { message: "Store url cannot exceed 50 characters." })
    .regex(/^(?!.*(?:[-_ ]){2,})[a-zA-Z0-9_-]+$/, {
      message:
        "Only letters, numbers, hyphen, and underscore are allowed in the store url, and consecutive occurrences of hyphens, underscores, or spaces are not permitted."
    }),
  logo: z.object({ url: z.string() }).array().length(1, "Choose a logo image."),
  cover: z
    .object({ url: z.string() })
    .array()
    .length(1, "Choose a cover image."),
  featured: z.boolean()
  // status: z.string()
});

export type CategoryFormSchemaType = z.infer<typeof CategoryFormSchema>;
export type SubcategoryFormSchemaType = z.infer<typeof SubcategoryFormSchema>;
export type StoreFormSchemaType = z.infer<typeof StoreFormSchema>;
