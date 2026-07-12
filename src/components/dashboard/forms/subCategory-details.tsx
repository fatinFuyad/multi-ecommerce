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
import {
  SubcategoryFormSchema,
  SubcategoryFormSchemaType
} from "@/lib/schemas";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import axios from "@/lib/axios";
import { ApiResponse } from "@/lib/types";
import { CategoryDoc } from "@/models/Category";
import { SubcategoryDoc } from "@/models/Subcategory";
import { useRouter } from "next/navigation";
import ImageUpload from "../shared/image-upload";

interface SubcategoryDetailsProps {
  data?: Omit<SubcategoryDoc, "category"> & { category: CategoryDoc };
  categories: CategoryDoc[];
}

export default function SubcategoryDetails({
  data,
  categories
}: SubcategoryDetailsProps) {
  const { toast } = useToast(); // Hook for displaying toast messages
  const router = useRouter(); // Hook for routing

  // ...// 1. Define your form.
  const form = useForm<SubcategoryFormSchemaType>({
    resolver: zodResolver(SubcategoryFormSchema),
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
  async function onSubmit(values: SubcategoryFormSchemaType) {
    try {
      // we can create a new route for updating categories. then we don't need to pass id
      const isUpdateSession = Boolean(data?._id);
      let response;
      if (isUpdateSession && data?._id) {
        response = await axios.patch<
          ApiResponse<{ subcategory: SubcategoryDoc }>
        >(`/subcategories/${data._id}`, values);
      } else {
        response = await axios.post<
          ApiResponse<{ subcategory: SubcategoryDoc }>
        >("/subcategories", values);
      }

      // Upserting subcategory data // ⚠️ handle backend separetely
      // const response = await Subcategory.create({ data});

      // Displaying success message
      toast({
        title: isUpdateSession
          ? `Subcategory ${response.data.subcategory.name} has been updated.`
          : `Congratulations! ${response.data.subcategory.name} has now been created.`
      });

      // Redirect or Refresh data
      if (isUpdateSession) {
        router.refresh();
      } else {
        router.push("/dashboard/admin/subcategories");
      }
    } catch (error: any) {
      console.log(error);
      toast({
        variant: "destructive",
        title: "Oops!",
        description:
          error.response?.data.message ||
          "An Error occured while createing or updating subcategory"
      });
    }
  }

  return (
    <AlertDialog>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Subcategory Information</CardTitle>
          <CardDescription>
            {data?._id
              ? `Update ${data?.name} subcategory information.`
              : "Let's create a subcategory. You can edit subcategory later from the subcategories table or the subcategory page."}
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
                    <FormLabel>Subcategory</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter subcategory name" {...field} />
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
                    <FormLabel>Subcategory URL</FormLabel>
                    <FormControl>
                      <Input placeholder="unique-subcategory-url" {...field} />
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
                      <FormLabel>Feature Subcategory</FormLabel>
                      <FormDescription>
                        This Subcategory will appear on the home page
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading
                  ? "Submitting..."
                  : data?._id
                    ? "Save Subcategory"
                    : "Create Subcategory"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </AlertDialog>
  );
}
