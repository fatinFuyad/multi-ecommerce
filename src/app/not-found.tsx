import { Button } from "@/components/ui/button";
import Link from "next/link";

function NotFound() {
  return (
    <section className="text-center space-y-6 mt-4">
      <h1 className="text-3xl font-semibold">
        This page could not be found :(
      </h1>
      <Button asChild variant={"link"}>
        <Link href="/">Go back home</Link>
      </Button>
    </section>
  );
}

export default NotFound;
