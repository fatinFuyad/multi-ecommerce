"use client";

import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";

import Link from "next/link";

export default function Home() {
  const { status, data } = useSession();
  console.log(data);
  return (
    <div className="grid gap-8 p-6">
      <header className="flex justify-end items-center p-4 gap-4 h-16">
        <ThemeToggle />
        {status === "loading" ||
          (status === "unauthenticated" && (
            <>
              <Button onClick={() => signIn()}>Sign in</Button>
              <Button asChild>
                <Link href={"/signup"}>Sign up</Link>
              </Button>
            </>
          ))}

        {status === "authenticated" && (
          <>
            {data.user?.image ? (
              <Avatar className="size-8">
                <AvatarImage src={data.user.image} alt={data.user.name} />
                <AvatarFallback className="bg-primary text-white">
                  {data.user.name}
                </AvatarFallback>
              </Avatar>
            ) : (
              <div className="flex items-center justify-center size-8 rounded-full bg-primary p-1">
                <User />
              </div>
            )}
            <Button variant={"outline"} onClick={() => signOut()}>
              Sign out
            </Button>
          </>
        )}
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
        <Button variant={"outline"} asChild>
          <Link href={"/dashboard/admin/categories/new"}>Categoy</Link>
        </Button>
        <Button variant={"outline"} asChild>
          <Link href={"/dashboard/admin/subcategories/new"}>Subcategory</Link>
        </Button>
      </main>
    </div>
  );
}
