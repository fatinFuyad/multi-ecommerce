"use client";

// React
import axios from "axios";
// model

// Form handling utilities
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

// Schema

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
import { CategoryFormSchema } from "@/lib/schemas";
import { CategoryData, ICategory } from "@/models/Category";
import { useRouter } from "next/navigation";
import ImageUpload from "../shared/image-upload";

interface CategoryDetailsProps {
  //   data?: z.infer<typeof CategoryFormSchema>;
  data?: CategoryData;
  cloudinaryKey: string;
}

export default function CategoryDetails({
  data,
  cloudinaryKey
}: CategoryDetailsProps) {
  const { toast } = useToast(); // Hook for displaying toast messages
  const router = useRouter(); // Hook for routing
  // ...// 1. Define your form.
  const form = useForm<z.infer<typeof CategoryFormSchema>>({
    resolver: zodResolver(CategoryFormSchema),
    defaultValues: {
      name: data?.name || "",
      image: data?.image ? [{ url: data.url }] : [],
      url: data?.url || "",
      featured: data?.featured || false
    }
  });

  const isLoading = form.formState.isSubmitting;
  // 2. Define a submit handler.
  // ⚠️ Client side can't access backend models
  async function onSubmit(values: z.infer<typeof CategoryFormSchema>) {
    console.log(values);
    try {
      // we can create a new route for updating categories. then we don't need to pass id
      let response;
      if (data?._id) {
        response = await axios.patch<CategoryData>("/api/categories", {
          _id: data._id,
          name: values.name,
          image: values.image[0].url,
          url: values.url,
          featured: values.featured
        });
      } else {
        response = await axios.post<CategoryData, any, ICategory>(
          "/api/categories",
          {
            // id: data?._id ? data._id : undefined,
            name: values.name,
            image: values.image[0].url,
            url: values.url,
            featured: values.featured
          }
        );
      }

      // Upserting category data // ⚠️ handle backend separetely
      // const response = await Category.create({ data});

      // Displaying success message
      toast({
        title: data?._id
          ? "Category has been updated."
          : `Congratulations! ${response.data.name} has now been created.`
      });

      // Redirect or Refresh data
      if (data?._id) {
        router.refresh();
      } else {
        router.push("/dashboard/admin/categories");
      }
    } catch (error: any) {
      // const axiosErr = error as AxiosResponse;
      // console.log({ ...axiosErr });
      toast({
        variant: "destructive",
        title: "Oops!",
        description: error.response.data.message
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
                        cloudinaryKey={cloudinaryKey}
                        value={field.value.map((image) => image.url)}
                        disabled={isLoading}
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
              {/* 
              // Previous code only for testing with image url
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image</FormLabel>
                    <FormControl>
                      <Input
                        // type="email"
                        autoComplete="true"
                        placeholder="Enter image url"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category URL</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter you url" {...field} />
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
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
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
              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </AlertDialog>
  );
}
