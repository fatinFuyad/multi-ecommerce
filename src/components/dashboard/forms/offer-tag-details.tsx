"use client";

// React
import { useEffect } from "react";

import { IOfferTag } from "@/models/OfferTag";

// Form handling utilities
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

// Schema
import { OfferTagFormSchema, OfferTagFormSchemaType } from "@/lib/schemas";

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
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

// Queries
import { upsertOfferTag } from "@/queries/offer-tag";

// Utils
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface OfferTagDetailsProps {
  data?: IOfferTag;
}

function OfferTagDetails({ data }: OfferTagDetailsProps) {
  // Initializing necessary hooks
  const { toast } = useToast(); // Hook for displaying toast messages
  const router = useRouter(); // Hook for routing

  // Form hook for managing form state and validation
  const form = useForm<OfferTagFormSchemaType>({
    mode: "onChange", // Form validation mode
    resolver: zodResolver(OfferTagFormSchema), // Resolver for form validation
    defaultValues: {
      // Setting default form values from data (if available)
      name: data?.name,
      url: data?.url,
      _id: data?._id.toString() // for update the _id is needed
    }
  });

  // Loading status based on form submission
  const isSubmitting = form.formState.isSubmitting;

  // Reset form values when data changes
  useEffect(() => {
    if (data) {
      form.reset({
        name: data?.name,
        url: data?.url
      });
    }
  }, [data, form]);

  // Submit handler for form submission
  const handleSubmit = async (values: OfferTagFormSchemaType) => {
    try {
      // Upserting offerTag data
      const response = await upsertOfferTag({
        _id: data?._id,
        name: values.name,
        url: values.url
      });

      // Displaying success message
      toast({
        title: data?._id
          ? "Offer tag has been updated."
          : `Congratulations! '${response.offerTag.name}' is now created.`
      });

      // Redirect or Refresh data
      if (data?._id) {
        router.refresh();
      } else {
        router.push("/dashboard/admin/offer-tags");
      }
    } catch (error: any) {
      // Handling form submission errors
      console.log(error);
      toast({
        variant: "destructive",
        title: "Oops!",
        description: error.response?.data.message
      });
    }
  };

  return (
    <AlertDialog>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Offer Tag Information</CardTitle>
          <CardDescription>
            {data?._id
              ? `Update ${data?.name} offer tag information.`
              : " Lets create an offer tag. You can edit offer tag later from the offer tags table or the offer tag page."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <FormField
                disabled={isSubmitting}
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Offer tag name</FormLabel>
                    <FormControl>
                      <Input placeholder="Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                disabled={isSubmitting}
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Offer tag url</FormLabel>
                    <FormControl>
                      <Input placeholder="unique-offer-tag-url" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? "Submitting..."
                  : data?._id
                    ? "Save offer tag"
                    : "Create offer tag"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </AlertDialog>
  );
}

export default OfferTagDetails;
