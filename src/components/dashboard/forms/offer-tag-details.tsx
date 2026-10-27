"use client";

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

// Utils
import { useToast } from "@/hooks/use-toast";
import { upsertOfferTag } from "@/services/offer-tag";
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
    resolver: zodResolver(OfferTagFormSchema), // Resolver for form validation
    defaultValues: {
      // Setting default form values from data (if available)
      name: data?.name || "",
      url: data?.url || ""
    }
  });

  // Loading status based on form submission
  const { isSubmitting } = form.formState;

  // Submit handler for form submission
  const handleSubmit = async (values: OfferTagFormSchemaType) => {
    try {
      // Upserting offerTag data
      const offerTagRes = await upsertOfferTag({ ...values, _id: data?._id });

      // Displaying success message
      toast({
        title: data?._id
          ? "Offer tag has been updated."
          : `Congratulations! '${offerTagRes.name}' is now created.`
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
        title: "Oops! An Error",
        description: error.message
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
