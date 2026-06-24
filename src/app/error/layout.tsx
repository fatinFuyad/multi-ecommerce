import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ReactNode } from "react";

function layout({ children }: { children: ReactNode }) {
  return (
    <main className="grid gap-10 py-10 px-16 place-content-center">
      <div className="col-span-4 mt-10">
        <Button asChild variant={"outline"} className="mr-6">
          <Link href={"/"}>Homepage</Link>
        </Button>
        <Button asChild variant={"outline"}>
          <Link href={"/dashboard"}>Dashboard</Link>
        </Button>
      </div>
      <div>{children}</div>
    </main>
  );
}

export default layout;
