"use client";

import ReactStars from "react-rating-stars-component";
import ImageUploadStore from "../shared/upload-images";
import Input from "../ui/input";
import Select from "../ui/select";

import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { AddReviewSchema, AddReviewSchemaType } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ReviewWithUser } from "@/lib/types";
import { IProductVariant } from "@/models/Product";
import { IReview } from "@/models/Review";
import { upsertReview } from "@/services/review";
import { PulseLoader } from "react-spinners";

interface Props {
  productId: string;
  data?: IReview;
  variants: IProductVariant[];
  reviews: ReviewWithUser[];
  setReviews: Dispatch<SetStateAction<ReviewWithUser[]>>;
  // reviews: IReview[];
  // setReviews: Dispatch<SetStateAction<IReview[]>>;
}

export default function ReviewDetails({
  productId,
  data,
  variants,
  setReviews,
  reviews
}: Props) {
  // State for selected Variant
  const [activeVariant, setActiveVariant] = useState<IProductVariant>(variants[0]);

  // Temporary state for images
  const [images, setImages] = useState<{ url: string }[]>([]);

  // State for sizes
  const [sizes, setSizes] = useState<{ name: string; value: string }[]>([]);
  const { toast } = useToast();

  // Form hook for managing form state and validation
  const form = useForm<AddReviewSchemaType>({
    mode: "onBlur", // Form validation mode
    resolver: zodResolver(AddReviewSchema), // Resolver for form validation
    // Setting default form values from data (if available)
    defaultValues: {
      _id: data?._id,
      variantName: data?.variantName || activeVariant.variantName,
      rating: data?.rating || 0,
      size: data?.size || "",
      review: data?.review || "",
      quantity: data?.quantity || undefined,
      images: data?.images || [],
      color: data?.color || ""
    }
  });

  const { variantName } = form.getValues();

  // Loading status based on form submission
  const isSubmitting = form.formState.isSubmitting;
  const submitted = form.formState.isSubmitSuccessful;
  useEffect(() => {
    if (submitted) {
      form.reset();
    }
  }, [submitted]);

  // Errors
  const errors = form.formState.errors;

  // Submit handler for form submission
  const handleSubmit = async (values: AddReviewSchemaType) => {
    try {
      await new Promise(function (res) {
        setTimeout(() => {
          res("resolved");
        }, 1000);
      });

      const reviewRes = await upsertReview(productId, values);

      if (!reviewRes) throw new Error("Failed to Upsert review");
      const rev = reviews.filter((rev) => rev._id !== reviewRes._id);
      setReviews([...rev, reviewRes]);

      toast({
        title: "Successful",
        description: "Review Added Successfully"
      });
    } catch (error: any) {
      toast({
        title: "An Error Occurred",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const variantsInfo = variants.map((v) => ({
    name: v.variantName,
    value: v.variantName,
    image: v.variantImage,
    colors: v.colors.map((c) => c.color).join(",")
  }));

  useEffect(() => {
    form.setValue("size", "");
    const variant = variants.find((v) => v.variantName === variantName);
    if (variant) {
      const sizesData = variant.sizes.map((s) => ({
        name: s.size,
        value: s.size
      }));
      setActiveVariant(variant);
      setSizes(sizesData);
      form.setValue("color", variant.colors.map((c) => c.color).join(","));
    }
  }, [variantName]); // update when variant is changed

  return (
    <div>
      <div className="p-4 bg-secondary rounded-xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <div className="flex flex-col space-y-4">
              {/* Title */}
              <div className="pt-4">
                <h1 className="font-bold text-2xl">Add a review</h1>
              </div>
              {/* Form items */}
              <div className="flex flex-col gap-3">
                <FormField
                  control={form.control}
                  name="rating"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="flex items-center gap-x-2">
                          <ReactStars
                            count={5}
                            size={40}
                            color="#e2dfdf"
                            activeColor="#FFD804"
                            value={field.value}
                            onChange={field.onChange}
                            isHalf
                            edit={true}
                          />
                          <span>( {form.getValues().rating.toFixed(1)} out of 5.0)</span>
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <div className="w-full flex flex-wrap gap-x-4">
                  <div className="flex items-center flex-wrap gap-2">
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
                              options={variantsInfo}
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
                      <FormItem className="flex-1">
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
                    name="quantity"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input
                            name="quantity"
                            type="number"
                            placeholder="Quantity (Optional)"
                            onChange={(value) => {
                              field.onChange(value.toString());
                            }}
                            value={field.value ? field.value.toString() : ""} // Handle undefined gracefully
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="review"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <textarea
                          className="min-h-32 p-4 w-full rounded-xl focus:outline-none ring-1 ring-[transparent] focus:ring-primary-mid"
                          placeholder="Write your review..."
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="images"
                  render={({ field }) => (
                    <FormItem className="w-full xl:border-r">
                      <FormControl>
                        <ImageUploadStore
                          value={field.value.map((image) => image.url)}
                          disabled={isSubmitting}
                          onChange={(url: string) => {
                            setImages((prevImages) => {
                              const updatedImages = [...prevImages, { url }];
                              if (updatedImages.length <= 3) {
                                field.onChange(updatedImages);
                                return updatedImages;
                              } else {
                                return prevImages;
                              }
                            });
                          }}
                          onRemove={(url: string) =>
                            field.onChange([
                              ...field.value.filter((current) => current.url !== url)
                            ])
                          }
                          maxImages={3}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-2 text-destructive">
                {errors.rating && <p>{errors.rating.message}</p>}
                {errors.size && <p>{errors.size.message}</p>}
                {errors.review && <p>{errors.review.message}</p>}
              </div>
              <div className="w-full flex justify-end">
                <Button type="submit">
                  {isSubmitting ? <PulseLoader size={5} color="#fff" /> : "Submit Review"}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
