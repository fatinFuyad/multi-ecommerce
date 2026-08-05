"use client";

// React, Next.js

// Form handling utilities
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

// Schema
import { StoreShippingFormSchema, StoreShippingFormSchemaType } from "@/lib/schemas";

// UI Components
import { AlertDialog } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { useToast } from "@/hooks/use-toast";
import { StoreShippingType } from "@/models/Store";
import { updateStoreShipping } from "@/queries/store";
import { NumberInput } from "@tremor/react";

interface PropsType {
  data: StoreShippingType;
}

function StoreShippingDetails({ data }: PropsType) {
  const { toast } = useToast();

  // Form hook for managing form state and validation
  const form = useForm<StoreShippingFormSchemaType>({
    mode: "onChange",
    resolver: zodResolver(StoreShippingFormSchema),
    defaultValues: {
      defaultShippingService: data?.defaultShippingService,
      defaultShippingFeePerItem: data?.defaultShippingFeePerItem,
      defaultShippingFeeForAdditionalItem: data?.defaultShippingFeeForAdditionalItem,
      defaultShippingFeePerKg: data?.defaultShippingFeePerKg,
      defaultShippingFeeFixed: data?.defaultShippingFeeFixed,
      defaultDeliveryTimeMin: data?.defaultDeliveryTimeMin,
      defaultDeliveryTimeMax: data?.defaultDeliveryTimeMax,
      returnPolicy: data?.returnPolicy
    }
  });

  const isSubmitting = form.formState.isSubmitting;

  // Submit handler for form submission
  async function onSubmit(values: StoreShippingFormSchemaType) {
    try {
      console.log(values);
      // StoreStoreShippingType store defaultShipping details
      await updateStoreShipping(data._id, {
        defaultShippingService: values.defaultShippingService,
        defaultShippingFeePerItem: values.defaultShippingFeePerItem,
        defaultShippingFeeForAdditionalItem: values.defaultShippingFeeForAdditionalItem,
        defaultShippingFeePerKg: values.defaultShippingFeePerKg,
        defaultShippingFeeFixed: values.defaultShippingFeeFixed,
        defaultDeliveryTimeMin: values.defaultDeliveryTimeMin,
        defaultDeliveryTimeMax: values.defaultDeliveryTimeMax,
        returnPolicy: values.returnPolicy
      });

      toast({
        title: "Store default shipping details have been updated."
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "An Error Occurred!",
        description: error.response?.data.message
      });
    }
  }

  return (
    <AlertDialog>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Store Shipping details</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="defaultShippingService"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Shipping Service name</FormLabel>
                    <FormControl>
                      <Input placeholder="Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex flex-wrap gap-4">
                <FormField
                  control={form.control}
                  name="defaultShippingFeePerItem"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Shipping fee per item</FormLabel>
                      <FormControl>
                        <NumberInput
                          defaultValue={field.value}
                          onValueChange={field.onChange}
                          min={0}
                          step={0.1}
                          className="shadow-sm border-border rounded-md px-4"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="defaultShippingFeeForAdditionalItem"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Shipping fee for additional item</FormLabel>
                      <FormControl>
                        <NumberInput
                          defaultValue={field.value}
                          onValueChange={field.onChange}
                          min={0}
                          step={0.1}
                          className="shadow-sm border-border rounded-md px-4"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-wrap gap-4">
                <FormField
                  control={form.control}
                  name="defaultShippingFeePerKg"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Shipping fee per kg</FormLabel>
                      <FormControl>
                        <NumberInput
                          defaultValue={field.value}
                          onValueChange={field.onChange}
                          min={0}
                          step={0.1}
                          className="shadow-sm border-border rounded-md px-4"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="defaultShippingFeeFixed"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Fixed Shippig fee</FormLabel>
                      <FormControl>
                        <NumberInput
                          defaultValue={field.value}
                          onValueChange={field.onChange}
                          min={0}
                          step={0.1}
                          className="shadow-sm border-border rounded-md px-4"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-wrap gap-4">
                <FormField
                  control={form.control}
                  name="defaultDeliveryTimeMin"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Minimum Delivery time (days)</FormLabel>
                      <FormControl>
                        <NumberInput
                          defaultValue={field.value}
                          onValueChange={field.onChange}
                          min={1}
                          className="shadow-sm border-border rounded-md px-4"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="defaultDeliveryTimeMax"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Maximum Delivery time (days)</FormLabel>
                      <FormControl>
                        <NumberInput
                          defaultValue={field.value}
                          onValueChange={field.onChange}
                          min={1}
                          className="shadow-sm border-border rounded-md px-4"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
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
              <Button type="submit">
                {isSubmitting ? "Submitting..." : "Save changes"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </AlertDialog>
  );
}

export default StoreShippingDetails;
