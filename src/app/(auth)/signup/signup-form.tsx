"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { UserFormSchema, UserFormSchemaType } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function SignupForm() {
  const { toast } = useToast();

  // 1. Define your form.
  const form = useForm<z.infer<typeof UserFormSchema>>({
    resolver: zodResolver(UserFormSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: ""
    }
  });

  // 2. Define a submit handler.
  async function onSubmit(values: UserFormSchemaType) {
    console.log(values);
    try {
      await axios.post("/api/signup", values);

      // creating direct sign in after signup
      await signIn("credentials", {
        identifier: values.email,
        password: values.password,
        callbackUrl: "/dashboard"
      });
    } catch (error: any) {
      console.log({ ...error });
      toast({
        title: "Error",
        description: error.response?.data.message,
        variant: "destructive"
      });
    }
  }

  return (
    <div className="grid gap-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Js Smith" {...field} />
                </FormControl>
                <FormMessage className="text-destructive" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input
                    placeholder="jsSmith (username must be unique)"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-destructive" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="jssmith@example.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-destructive" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="********" {...field} />
                </FormControl>
                <FormMessage className="text-destructive" />
              </FormItem>
            )}
          />

          <Button type="submit">Submit</Button>
        </form>
      </Form>

      <Separator />
      <div className="flex flex-wrap gap-6 mt-6 justify-center items-center">
        <p>Or</p>
        <Button
          onClick={() => signIn("google")}
          className="justify-self-start"
          variant={"secondary"}
          size="lg"
        >
          <Image
            src="https://authjs.dev/img/providers/google.svg"
            alt="Google logo"
            height="24"
            width="24"
          />
          Continue with Google
        </Button>
        <Button
          onClick={() => signIn("github")}
          className="justify-self-start"
          variant={"secondary"}
          size="lg"
        >
          <Image
            src="https://authjs.dev/img/providers/github.svg"
            alt="Google logo"
            height="24"
            width="24"
          />
          Continue with Github
        </Button>
      </div>
    </div>
  );
}
