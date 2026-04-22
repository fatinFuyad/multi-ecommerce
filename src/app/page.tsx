import { ModeToggle } from "@/components/shared/dark-mode";
import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default function Home() {
  return (
    <div className="grid gap-8 p-6">
      <nav className="flex justify-end gap-6">
        <ModeToggle />
        <UserButton />
      </nav>
      <h1 className="text-4xl">Mulit Ecommerce Application</h1>
      <h1 className="text-4xl font-barlow">Mulit Ecommerce Application</h1>
      <main className="flex flex-wrap gap-6">
        <Button asChild>
          <Link href={"/dashboard"}>Dashboard</Link>
        </Button>
        <Button asChild>
          <Link href={"/dashboard/admin"}>Admin</Link>
        </Button>
        <Button variant={"destructive"}>Click Here</Button>
        <Button variant={"ghost"}>Click Here</Button>
        <Button variant={"link"}>Click Here</Button>
        <Button variant={"outline"}>Click Here</Button>
        <Button variant={"secondary"}>Click Here</Button>
      </main>
    </div>
  );
}
