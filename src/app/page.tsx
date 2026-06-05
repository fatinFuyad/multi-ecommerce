import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  SignInButton,
  SignOutButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton
} from "@clerk/nextjs";
import Link from "next/link";

export default function Home() {
  return (
    <div className="grid gap-8 p-6">
      <header className="flex justify-end items-center p-4 gap-4 h-16">
        <ThemeToggle />
        {/* Show the sign-in and sign-up buttons when the user is signed out */}
        <SignedOut>
          <SignInButton />
          <SignUpButton />
        </SignedOut>
        {/* Show the user button when the user is signed in */}
        <SignedIn>
          <UserButton />
          <SignOutButton />
        </SignedIn>
      </header>
      <h1 className="text-4xl">Mulit Ecommerce Application</h1>
      <h1 className="text-4xl font-barlow">Mulit Ecommerce Application</h1>
      <main className="flex flex-wrap gap-6">
        <Button asChild>
          <Link href={"/dashboard"}>Dashboard</Link>
        </Button>
        <Button asChild>
          <Link href={"/dashboard/admin"}>Admin</Link>
        </Button>
        <Button asChild>
          <Link href={"/dashboard/seller"}>Seller</Link>
        </Button>
        <Button variant={"secondary"} asChild>
          <Link href={"/payments"}>Payments</Link>
        </Button>
        <Button variant={"destructive"}>Warning</Button>
        <Button variant={"link"}>Link</Button>
        <Button variant={"outline"}>Outline</Button>
        <Button variant={"ghost"}>Click Here</Button>
        <Button variant={"secondary"}>Click Here</Button>
      </main>
    </div>
  );
}
