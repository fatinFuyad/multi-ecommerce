import { ThemeToggle } from "@/components/shared/theme-toggle";
import { UserButton } from "@clerk/nextjs";

export default function DashboardHeader() {
  return (
    <div className="fixed z-20 left-0 right-0 top-0 md:left-80 bg-background/80 backdrop-blur-md p-4 flex items-center gap-4 border-b">
      <div className="flex items-center gap-2 ml-auto">
        <UserButton afterSignOutUrl="/" />
        <ThemeToggle />
      </div>
    </div>
  );
}
