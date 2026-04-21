import { ModeToggle } from "@/components/shared/dark-mode";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="grid grid-cols-[300px_1fr_300px]">
      <main className="flex flex-col col-start-2 gap-8 items-center sm:items-start">
        <ModeToggle />
        <h1 className="text-4xl">Mulit Ecommerce Application</h1>
        <h1 className="text-4xl font-barlow">Mulit Ecommerce Application</h1>
        <button>Click Here</button>
        <Button>Click Here</Button>
        <Button variant={"destructive"}>Click Here</Button>
        <Button variant={"ghost"}>Click Here</Button>
        <Button variant={"link"}>Click Here</Button>
        <Button variant={"outline"}>Click Here</Button>
        <Button variant={"secondary"}>Click Here</Button>
      </main>
    </div>
  );
}
