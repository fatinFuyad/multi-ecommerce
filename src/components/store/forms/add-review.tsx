"use client";

import ColorWheel from "@/components/shared/color-wheel";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { AddReviewSchema } from "@/lib/schemas";
import { IProductVariant } from "@/models/Product";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import ReactStars from "react-rating-stars-component";
import { z } from "zod";
import Select from "../ui/select";
import { Button } from "../ui/button";

export default function AddReviewForm({
  productId,
  variants
}: {
  productId: string;
  variants: IProductVariant[];
}) {
  // State for selected Variant
  const [activeVariant, setActiveVariant] = useState<IProductVariant>(variants[0]);

  // State for sizes
  const [sizes, setSizes] = useState<any>([]);

  // Form hook for managing form state and validation
  const form = useForm<z.infer<typeof AddReviewSchema>>({
    mode: "onChange", // Form validation mode
    resolver: zodResolver(AddReviewSchema), // Resolver for form validation
    defaultValues: {
      // Setting default form values from data (if available)
      variantName: activeVariant.variantName,
      rating: 0,
      size: "",
      review: ""
    }
  });

  // Loading status based on form submission
  const isLoading = form.formState.isSubmitting;

  // Get product details that are needed to add review info

  // Submit handler for form submission
  const handleSubmit = async (values: z.infer<typeof AddReviewSchema>) => {
    try {
      // Add Review
      console.log(values);

      // Displaying success message
      toast.success("Review Added Successfully");
    } catch (error: any) {
      // Handling form submission errors
      console.log(error);
      toast.error(error.toString());
    }
  };

  const variantNames = variants.map((v) => ({
    name: v.variantName,
    value: v.variantName,
    image: v.variantImage,
    colors: v.colors[0].color
  }));

  useEffect(() => {
    form.setValue("size", "");
    const name = form.getValues().variantName;
    const variant = variants.find((v) => v.variantName === name);
    if (variant) {
      const sizes_data = variant.sizes.map((s) => ({
        name: s.size,
        value: s.size
      }));
      setActiveVariant(variant);
      if (sizes) setSizes(sizes_data);
    }
  }, [form.getValues().variantName]);
  console.log(form.watch().review);

  return (
    <div className="bg-[#f5f5f5] p-4 rounded-xl">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <div className="flex flex-col space-y-4">
            {/* Title */}
            <div>
              <h1 className="text-xl font-bold">Add a review</h1>
            </div>
            {/* Form items */}
            <div className="flex flex-col gap-3">
              <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex items-center gap-x-1">
                        <ReactStars
                          count={5}
                          size={32}
                          color="#e2dfdf"
                          activeColor="#FFD804"
                          value={field.value}
                          onChange={field.onChange}
                          isHalf
                          edit={true}
                        />
                        <span>{form.getValues().rating.toFixed(1)} out of 5.0</span>
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="flex items-center flex-wrap gap-2">
                <ColorWheel colors={activeVariant.colors} size={48} />
                <FormField
                  control={form.control}
                  name="variantName"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select
                          name={field.name}
                          value={field.value}
                          onChange={field.onChange}
                          options={variantNames}
                          placeholder="Select product"
                          subPlaceholder="Please select a product"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="size"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Select
                        name={field.name}
                        value={field.value}
                        onChange={field.onChange}
                        options={sizes}
                        placeholder="Select size"
                        subPlaceholder="Please select a size"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="review"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <textarea
                        className="min-h-32 p-4 w-full rounded-xl focus:outline-none"
                        placeholder="Write your review..."
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="w-full flex justify-end">
              <Button type="submit" className="w-36">
                Submit Review
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
