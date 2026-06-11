"use client";

// Form handling utilities
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";

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
import { SubCategoryFormSchema } from "@/lib/schemas";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { SubCategoryDataType } from "@/lib/types";
import { CategoryData } from "@/models/Category";
import { createSubCategory, updateSubCategory } from "@/queries/subCategory";
import { useRouter } from "next/navigation";
import ImageUpload from "../shared/image-upload";

interface SubCategoryDetailsProps {
  // data?: SubCategoryDataType;
  data?: SubCategoryDataType;
  categories: CategoryData[];
}

export default function SubCategoryDetails({
  data,
  categories
}: SubCategoryDetailsProps) {
  const { toast } = useToast(); // Hook for displaying toast messages
  const router = useRouter(); // Hook for routing

  // ...// 1. Define your form.
  const form = useForm<z.infer<typeof SubCategoryFormSchema>>({
    resolver: zodResolver(SubCategoryFormSchema),
    defaultValues: {
      name: data?.name || "",
      image: data?.image ? [{ url: data.image }] : [],
      url: data?.url || "",
      featured: data?.featured || false,
      category: data?.category._id.toString()
    }
  });

  const isLoading = form.formState.isSubmitting;
  // 2. Define a submit handler.
  // ⚠️ Client side can't access backend models
  async function onSubmit(values: z.infer<typeof SubCategoryFormSchema>) {
    try {
      // we can create a new route for updating categories. then we don't need to pass id
      let result;
      const isUpdateSession = Boolean(data?._id);
      if (isUpdateSession && data?._id) {
        result = await updateSubCategory(data._id, values);
      } else {
        result = await createSubCategory(values);
      }

      // Upserting subCategory data // ⚠️ handle backend separetely
      // const response = await SubCategory.create({ data});

      // Displaying success message
      toast({
        title: isUpdateSession
          ? "Sub-category has been updated."
          : `Congratulations! ${result?.name} has now been created.`
      });

      // Redirect or Refresh data
      if (isUpdateSession) {
        router.refresh();
      } else {
        router.push("/dashboard/admin/subCategories");
      }
    } catch (error: any) {
      console.log(error);
      toast({
        variant: "destructive",
        title: "Oops!",
        description:
          error.response?.data.message ||
          "An Error occured while createing or updating subCategory"
      });
    }
  }

  return (
    <AlertDialog>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>SubCategory Information</CardTitle>
          <CardDescription>
            {data?._id
              ? `Update ${data?.name} subCategory information.`
              : "Let's create a sub-category. You can edit sub-category later from the sub-categories table or the sub-category page."}
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
                    <FormLabel>Sub-category</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter subCategory name" {...field} />
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
                    <FormLabel>Sub-category URL</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter you url" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Select category</FormLabel>
                      <Select
                        disabled={isLoading}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
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
                    </FormItem>
                  );
                }}
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
                      <FormLabel>Feature Sub-category</FormLabel>
                      <FormDescription>
                        This Sub-category will appear on the home page
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
