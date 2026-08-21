import { Button } from "@/components/ui/button";

import Link from "next/link";

export default async function HomePage() {
  return (
    <div className="grid gap-8 p-6">
      <h1 className="text-4xl">Multi Ecommerce Application</h1>
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
          <Link href={"/"}>Home</Link>
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
