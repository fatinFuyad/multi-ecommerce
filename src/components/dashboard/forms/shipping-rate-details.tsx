"use client";

// Form handling utilities
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

// Schema
import { ShippingRateFormSchema, ShippingRateFormSchemaType } from "@/lib/schemas";

// UI Components
import { AlertDialog } from "@/components/ui/alert-dialog";
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

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Utils
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { CountryWithShippingRates } from "@/lib/types";
import { NumberInput } from "@tremor/react";
import { upsertShippingRate } from "@/queries/store";
import { useRouter } from "next/navigation";

interface PropsType {
  data: CountryWithShippingRates;
  storeUrl: string;
}

function ShippingRateDetails({ data }: PropsType) {
  const router = useRouter();
  const { toast } = useToast();

  // Form hook for managing form state and validation
  const form = useForm<ShippingRateFormSchemaType>({
    resolver: zodResolver(ShippingRateFormSchema),
    defaultValues: {
      // Setting default form values from data (if available)
      countryId: data.country._id.toString(),
      countryName: data.country.name,
      shippingService: data.shippingRate?.shippingService,
      shippingFeePerItem: data.shippingRate?.shippingFeePerItem || 0,
      shippingFeeForAdditionalItem: data.shippingRate?.shippingFeeForAdditionalItem || 0,
      shippingFeePerKg: data.shippingRate?.shippingFeePerKg || 0,
      shippingFeeFixed: data.shippingRate?.shippingFeeFixed || 0,
      deliveryTimeMin: data.shippingRate?.deliveryTimeMin || 1,
      deliveryTimeMax: data.shippingRate?.deliveryTimeMax || 1,
      returnPolicy: data.shippingRate?.returnPolicy
    }
  });

  // Loading status based on form submission
  const isSubmitting = form.formState.isSubmitting;

  // Submit handler for form submission
  const handleSubmit = async (values: ShippingRateFormSchemaType) => {
    try {
      // Upserting category data
      const response = await upsertShippingRate(data.storeId, values);
      toast({
        title: "Shipping rate upserted successfully",
        description: response.message
      });

      router.refresh();
    } catch (error: any) {
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
          <CardTitle>Shipping Rate</CardTitle>
          <CardDescription>
            Update Shipping rate information for {data.country.name}.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="shippingService"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input {...field} placeholder="Shipping service" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="shippingFeePerItem"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Shipping fee per item</FormLabel>
                      <FormControl>
                        <NumberInput
                          defaultValue={field.value}
                          onValueChange={field.onChange}
                          step={0.1}
                          min={0}
                          className="pl-2 !shadow-none rounded-md"
                          placeholder="Shipping fee per item"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="shippingFeeForAdditionalItem"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Shipping fee for additional item</FormLabel>
                      <FormControl>
                        <NumberInput
                          defaultValue={field.value}
                          onValueChange={field.onChange}
                          step={0.1}
                          min={0}
                          className="pl-2 !shadow-none rounded-md"
                          placeholder="Shipping fee per item"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="shippingFeePerKg"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Shipping fee per kg</FormLabel>
                      <FormControl>
                        <NumberInput
                          defaultValue={field.value}
                          onValueChange={field.onChange}
                          step={0.1}
                          min={0}
                          className="pl-2 !shadow-none rounded-md"
                          placeholder="Shipping fee per kg"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="shippingFeeFixed"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Fixed Shipping fee</FormLabel>
                      <FormControl>
                        <NumberInput
                          defaultValue={field.value}
                          onValueChange={field.onChange}
                          step={0.1}
                          min={0}
                          className="pl-2 !shadow-none rounded-md"
                          placeholder="Fixed shipping fee"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="deliveryTimeMin"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Delivery time min </FormLabel>
                      <FormControl>
                        <NumberInput
                          defaultValue={field.value}
                          onValueChange={field.onChange}
                          min={1}
                          className="pl-2 !shadow-none rounded-md"
                          placeholder="Minimum Delivery time (days)"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="deliveryTimeMax"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Delivery time max </FormLabel>
                      <FormControl>
                        <NumberInput
                          defaultValue={field.value}
                          onValueChange={field.onChange}
                          min={1}
                          className="pl-2 !shadow-none rounded-md"
                          placeholder="Maximum Delivery time (days)"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="returnPolicy"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Return policy</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="What's the return policy for your store ?"
                          className="p-4"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="mt-4">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "loading..." : "Save changes"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </AlertDialog>
  );
}

export default ShippingRateDetails;
