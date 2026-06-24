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
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

const identifierSchema = z
  .string()
  .min(4, "Username or Email should be at least 4 characters")
  .refine(
    (val) => {
      const isEmail = z.email().safeParse(val).success;
      const isUsername = /^[a-zA-Z0-9_]{4,24}$/.test(val);
      return isEmail || isUsername;
    },
    {
      message:
        "Must be a valid email or username and shouldn't contain special characters"
    }
  );
// identifier: z
//   .string()
//   .min(4, { error: "Username or Email should be at least 4 characters" })
//   .max(24, { error: "Username or Email should not exceed 24 characters" })
//   .regex(/^[a-zA-Z0-9\@\.\-\_]+$/, { // can't handle: fuyad_@gmail.com...
//     error: "Invalid username or email as contains special characters"
//   }),

const signInSchema = z.object({
  identifier: identifierSchema, // can handle : fuyad_@gmail.com...
  password: z
    .string()
    .min(6, "Password should be at least 6 characters")
    .max(24, "Too long password! Try within 24 characters")
});

export function SigninForm() {
  const { toast } = useToast();
  const router = useRouter();

  // 1. Define your form.
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    mode: "onChange",
    defaultValues: {
      identifier: "",
      password: ""
    }
  });
  const isSubmitting = form.formState.isSubmitting;
  // 2. Define a submit handler.
  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    const result = await signIn("credentials", {
      redirect: false,
      identifier: data.identifier,
      password: data.password
    });

    console.log(result);
    if (result?.error) {
      if (result.error === "CredentialsSignin") {
        toast({
          title: "Login Failed",
          description: "Incorrect username or password",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive"
        });
      }
    }

    if (result?.url) {
      router.replace("/dashboard");
    }
  };

  return (
    <div className="grid gap-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="identifier"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Identifier</FormLabel>
                <FormControl>
                  <Input
                    disabled={isSubmitting}
                    placeholder="Enter your username or email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
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
                  <Input
                    disabled={isSubmitting}
                    type="password"
                    placeholder="Enter your password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader className="animate-spin" /> Submitting
              </>
            ) : (
              "Submit"
            )}
          </Button>
        </form>
      </Form>
      <div className="flex flex-col gap-4 mt-6 justify-center items-center">
        <p className="text-muted-foreground">
          Not a member yet?
          <Button variant="link" className="dark:text-purple-500" asChild>
            <Link href="/signup">Sign up</Link>
          </Button>
        </p>
        <p>Or</p>
        <div className="flex flex-wrap gap-6 mt-4 justify-center items-center">
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
    </div>
  );
}
