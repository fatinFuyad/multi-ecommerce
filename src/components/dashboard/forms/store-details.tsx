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
import { StoreFormSchema, StoreFormSchemaType } from "@/lib/schemas";
import { IStore } from "@/models/Store";
import { upsertStore } from "@/services/store";
import { useRouter } from "next/navigation";
import ImageUpload from "../shared/image-upload";
import { useEffect } from "react";

interface StoreDetailsProps {
  data?: IStore;
}

export default function StoreDetails({ data }: StoreDetailsProps) {
  const { toast } = useToast(); // Hook for displaying toast messages
  const router = useRouter(); // Hook for routing

  // 1. Define your form.
  const form = useForm<StoreFormSchemaType>({
    resolver: zodResolver(StoreFormSchema),
    defaultValues: {
      // Setting default form values from data (if available)
      name: data?.name,
      description: data?.description,
      email: data?.email,
      phone: data?.phone,
      logo: data?.logo ? [{ url: data.logo }] : [],
      cover: data?.cover ? [{ url: data.cover }] : [],
      featured: data?.featured || false,
      url: data?.url
    }
  });

  // Reset form values when data changes
  useEffect(() => {
    if (data) {
      form.reset({
        name: data?.name,
        description: data?.description,
        email: data?.email,
        phone: data?.phone,
        logo: [{ url: data?.logo }],
        cover: [{ url: data?.cover }],
        url: data?.url,
        featured: data?.featured
      });
    }
  }, [data, form]);

  // 2. Define a submit handler.
  // ⚠️ Client side can't access backend models
  async function onSubmit(values: StoreFormSchemaType) {
    try {
      const isUpdateSession = !!data?._id;
      if (isUpdateSession) values._id = data._id;

      const storeRes = await upsertStore(values);

      toast({
        title: "Congratulations!",
        description: isUpdateSession
          ? `Your store ${storeRes.name} has been updated successfully`
          : `Your store ${storeRes.name} has been created successfully`
      });

      // make sure to update url if the store-url is changed. otherwise there will be error if previous store url is used to visit other sub-routes
      router.push(`/dashboard/seller/stores/${storeRes.url}/settings`);
    } catch (error: any) {
      toast({
        title: "Opps! Error",
        description: error.message,
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
                              ...field.value.filter((current) => current.url !== url)
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
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
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
                    ? "Save Store"
                    : "Create Store"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </AlertDialog>
  );
}
