import mongoose from "mongoose";
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
    .max(50, { message: "Category url cannot exceed 50 characters." }),
  // .regex(/^(?!.*(?:[-_ ]){2,})[a-zA-Z0-9_-]+$/, {
  //   error:
  //     "Only letters, numbers, hyphen, and underscore are allowed in the category url, and consecutive occurrences of hyphens, underscores, or spaces are not permitted."
  // }),
  featured: z.boolean().default(false).optional() // .default(false) // adding default doesn't work in form resolver
});

// type CategoryForm = z.infer<typeof CategoryFormSchema>;

export const SubCategoryFormSchema = z.object({
  name: z
    .string({
      error: "SubCategory name is required."
    })
    .min(2, { message: "SubCategory name must be at least 2 characters long." })
    .max(50, { message: "SubCategory name cannot exceed 50 characters." })
    .regex(/^(?!.*[ _-]{2})[A-Za-z0-9]+(?:[ _-][A-Za-z0-9]+)*$/, {
      message:
        "Only alphanumeric characters and only one separator like space( ), underscore(_), hyphen(-) between words are allowed. Also starting or ending with separators not allowed."
    }),
  image: z
    .object({
      url: z.string()
    })
    .array()
    .length(1, "Choose an image for subCategory."),
  // image: z.string(),
  url: z
    .string({
      message: "SubCategory url is required"
    })
    .min(2, { message: "SubCategory url must be at least 2 characters long." })
    .max(50, { message: "SubCategory url cannot exceed 50 characters." }),
  featured: z.boolean().default(false).optional(),
  // category: z.custom<mongoose.Types.ObjectId>(
  //   (val) => typeof val === mongoose.Types.ObjectId.toString(),
  //   { message: "Category ID is required for creating subCateogy" }
  // )
  category: z
    .string("Category ID is required for creating subCateogy")
    .nonoptional()
});
