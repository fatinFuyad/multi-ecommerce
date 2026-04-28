import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AdminCategoriesPage() {
  return (
    <div>
      Admin categories page
      <Button variant={"outline"} asChild>
        <Link href={"/dashboard/admin/categories/new"}>Create Category</Link>
      </Button>
    </div>
  );
}
