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

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { CategoryFormSchema, CategoryFormSchemaType } from "@/lib/schemas";
import { CategoryDoc } from "@/models/Category";
import { createCategory, updateCategory } from "@/queries/category";
import { useRouter } from "next/navigation";
import ImageUpload from "../shared/image-upload";

interface CategoryDetailsProps {
  data?: CategoryDoc;
}

export default function CategoryDetails({ data }: CategoryDetailsProps) {
  const { toast } = useToast(); // Hook for displaying toast messages
  const router = useRouter(); // Hook for routing

  // 1. Define your form.
  const form = useForm<CategoryFormSchemaType>({
    resolver: zodResolver(CategoryFormSchema),
    defaultValues: {
      name: data?.name || "",
      image: data?.image ? [{ url: data.image }] : [],
      url: data?.url || "",
      featured: data?.featured || false
    }
  });

  const isLoading = form.formState.isSubmitting;
  // Reset form values when data changes
  // useEffect(() => {
  //   if (data) {
  //     form.reset({
  //       name: data.name,
  //       image: [{ url: data.image }],
  //       url: data.url,
  //       featured: data.featured,
  //     });
  //   }
  // }, [data, form]);

  // 2. Define a submit handler.
  // ⚠️ Client side can't access backend models
  async function onSubmit(values: CategoryFormSchemaType) {
    try {
      // we can create a new route for updating categories. then we don't need to pass id
      const isUpdateSession = Boolean(data?._id);
      let response;
      if (isUpdateSession && data?._id) {
        response = await updateCategory(data._id, values);
      } else {
        response = await createCategory(values);
      }

      // Displaying success message
      toast({
        title: isUpdateSession
          ? "Category has been updated."
          : `Congratulations! ${response?.category.name} has now been created.`
      });

      // Redirect or Refresh data
      if (isUpdateSession) {
        router.refresh();
      } else {
        router.push("/dashboard/admin/categories");
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Oops!",
        description: error.message
      });
    }
  }

  return (
    <AlertDialog>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Category Information</CardTitle>
          <CardDescription>
            {data?._id
              ? `Update ${data?.name} category information.`
              : "Lets create a category. You can edit category later from the categories table or the category page."}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <ImageUpload
                        type="profile"
                        value={field.value.map((image) => image.url)}
                        disabled={isLoading}
                        onChange={(url) => field.onChange([{ url }])}
                        onRemove={(url) =>
                          field.onChange([
                            ...field.value.filter((current) => current.url !== url)
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
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter category name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category URL</FormLabel>
                    <FormControl>
                      <Input placeholder="unique-category-url" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="featured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Feature Category</FormLabel>
                      <FormDescription>
                        This Category will appear on the home page
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading
                  ? "Submitting..."
                  : data?._id
                    ? "Save Category"
                    : "Create Category"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </AlertDialog>
  );
}
