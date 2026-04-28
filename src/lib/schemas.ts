import * as z from "zod";

export const CategoryFormSchema = z.object({
  name: z
    .string({
      error: "Category name is required."
    })
    .min(2, { message: "Category name must be at least 2 characters long." })
    .max(50, { message: "Category name cannot exceed 50 characters." })
    .regex(/^[a-zA-Z0-9\s]+$/, {
      message:
        "Only letters, numbers, and spaces are allowed in the category name."
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
