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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import axios from "@/lib/axios";
import { StoreFormSchema, StoreFormSchemaType } from "@/lib/schemas";
import { ApiResponse } from "@/lib/types";
import { StoreDoc } from "@/models/Store";
import ImageUpload from "../shared/image-upload";

interface StoreDetailsProps {
  data?: StoreDoc;
}

export default function StoreDetails({ data }: StoreDetailsProps) {
  const { toast } = useToast(); // Hook for displaying toast messages
  // const router = useRouter(); // Hook for routing

  // 1. Define your form.
  const form = useForm<StoreFormSchemaType>({
    resolver: zodResolver(StoreFormSchema),
    defaultValues: {
      // Setting default form values from data (if available)
      name: data?.name || "",
      description: data?.description || "",
      email: data?.email || "",
      phone: data?.phone || "",
      logo: data?.logo ? [{ url: data.logo }] : [],
      cover: data?.cover ? [{ url: data.cover }] : [],
      featured: data?.featured || false,
      url: data?.url || ""
    }
  });

  // const isLoading = form.formState.isSubmitting;
  // 2. Define a submit handler.
  // ⚠️ Client side can't access backend models
  async function onSubmit(values: StoreFormSchemaType) {
    try {
      console.log(values);
      const isUpdateSession = !!data?._id;
      let response;
      // values.user = seller.user.id as;
      if (isUpdateSession) {
        response = await axios.patch<ApiResponse<{ store: StoreDoc }>>(
          `/stores/${data._id}`,
          values
        );
      } else {
        response = await axios.post<ApiResponse<{ store: StoreDoc }>>(
          `/stores`,
          values
        );
      }

      toast({
        title: "Congratulations!",
        description: isUpdateSession
          ? `Your store ${response.data.store.name} has been updated successfully`
          : `Your store ${response.data.store.name} has been created successfully`
      });
    } catch (error: any) {
      toast({
        title: "An Error Occured",
        description:
          error.response?.data.message ||
          "Unexpected error while creating/updating the store",
        variant: "destructive"
      });
    }
  }

  return (
    <AlertDialog>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Store Information</CardTitle>
          <CardDescription>
            {data?._id
              ? `Update ${data?.name} store information.`
              : "Lets create a store. You can edit store later from the categories table or the store page."}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Logo - Cover */}
              <div className="relative py-2 mb-24">
                <FormField
                  control={form.control}
                  name="logo"
                  render={({ field }) => (
                    <FormItem className="absolute -bottom-20 -left-48 z-10 inset-x-96">
                      <FormControl>
                        <ImageUpload
                          type="profile"
                          value={field.value.map((image) => image.url)}
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
                  name="cover"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <ImageUpload
                          type="cover"
                          value={field.value.map((image) => image.url)}
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
              </div>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Store</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter store name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        // className="resize-none"
                        placeholder="Describe your store"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email & Phone */}
              <div className="flex flex-col md:flex-row gap-16">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter email for store" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Phone number</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter phone number for your store"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Store url</FormLabel>
                    <FormControl>
                      <Input placeholder="unique-store-url" {...field} />
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
                      <FormLabel>Feature Store</FormLabel>
                      <FormDescription>
                        This Store will appear on the home page
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting
                  ? "Submitting..."
                  : data?._id
                    ? "Save Store Data"
                    : "Create Store"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </AlertDialog>
  );
}
