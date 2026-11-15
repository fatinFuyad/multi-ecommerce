"use client";

// React
import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";

// Form handling utilities
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

// UI Components
import CountrySelector from "@/components/shared/country-selector";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

// Utils
import { useToast } from "@/hooks/use-toast";
import { ShippingAddressSchema, ShippingAddressSchemaType } from "@/lib/schemas";
import { UserShippingAddressType } from "@/models/Order";
import { ICountry } from "@/models/Shipping-Rate";
import { upsertShippingAddress } from "@/services/user";
import { useRouter } from "next/navigation";
import { Button } from "../../ui/button";
import { CountrySelect } from "@/lib/types";

interface AddressDetailsProps {
  data?: UserShippingAddressType;
  // data?: any;
  countries: ICountry[];
  setShow: Dispatch<SetStateAction<boolean>>;
}

const AddressDetails: FC<AddressDetailsProps> = ({ data, countries, setShow }) => {
  // Initializing necessary hooks
  const { toast } = useToast(); // Hook for displaying toast messages
  const router = useRouter(); // Hook for routing

  // State for country selector
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // State for selected country
  const [country, setCountry] = useState<string>(data?.country.name || countries[0]._id);

  // Form hook for managing form state and validation
  const form = useForm<ShippingAddressSchemaType>({
    resolver: zodResolver(ShippingAddressSchema), // Resolver for form validation
    defaultValues: {
      // Setting default form values from data (if available)
      firstName: data?.firstName,
      lastName: data?.lastName,
      address1: data?.address1,
      address2: data?.address2 || "",
      city: data?.city,
      country: data?.country._id || countries[0]._id,
      phone: data?.phone,
      state: data?.state,
      zipCode: data?.zipCode,
      default: data?.default
    }
  });

  // Loading status based on form submission
  const { isLoading, isSubmitSuccessful } = form.formState;

  // Submit handler for form submission
  const handleSubmit = async (values: ShippingAddressSchemaType) => {
    try {
      // Upserting category data
      values._id = data?._id;
      const response = await upsertShippingAddress(values);
      console.log(response);
      // Displaying success message
      toast({
        title: data?._id
          ? "Shipping address has been updated."
          : `Congratulations! Shipping address is now created.`
      });

      router.refresh(); // refresh data after update / create
      setShow(false);
    } catch (error: any) {
      // Handling form submission errors
      console.log(error);
      toast({
        variant: "destructive",
        title: "Oops!",
        description: error.toString()
      });
    }
  };

  const handleCountryChange = (name: string) => {
    const country = countries.find((c) => c.name === name);
    if (country) {
      form.setValue("country", country._id);
    }
    setCountry(name);
  };

  // Reset form values when submitted
  useEffect(() => {
    form.reset();
  }, [isSubmitSuccessful]);

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label>Contact information</label>
            <div className="flex items-center justify-between gap-3">
              <FormField
                disabled={isLoading}
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input placeholder="First name*" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                disabled={isLoading}
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input placeholder="Last name*" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              disabled={isLoading}
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem className="flex-1 w-[calc(50%-8px)] !mt-3">
                  <FormControl>
                    <Input placeholder="Phone number*" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-2">
            <label>Address</label>
            <div>
              <FormField
                disabled={isLoading}
                control={form.control}
                name="country"
                render={() => (
                  <FormItem className="flex-1 w-[calc(50%-8px)] !mt-3">
                    <FormControl>
                      <CountrySelector
                        id={"countries"}
                        open={isOpen}
                        onToggle={() => setIsOpen((prev) => !prev)}
                        onChange={(val) => handleCountryChange(val)}
                        selectedValue={
                          (countries.find((c) => c.name === country) as CountrySelect) ||
                          countries[0]
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="!mt-3 flex items-center justify-between gap-3">
              <FormField
                disabled={isLoading}
                control={form.control}
                name="address1"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input placeholder="Street, house/apartment/unit*" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                disabled={isLoading}
                control={form.control}
                name="address2"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input placeholder="Apt, suite, unit, etc (optional）" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="!mt-3 flex items-center justify-between gap-3">
              <FormField
                disabled={isLoading}
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input placeholder="State*" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                disabled={isLoading}
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input placeholder="City*" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              disabled={isLoading}
              control={form.control}
              name="zipCode"
              render={({ field }) => (
                <FormItem className="flex-1 w-[calc(50%-8px)] !mt-3">
                  <FormControl>
                    <Input placeholder="Zip code*" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" disabled={isLoading} className="rounded-md">
            {isLoading
              ? "loading..."
              : data?._id
                ? "Save address information"
                : "Create address"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default AddressDetails;
