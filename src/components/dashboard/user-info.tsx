import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Button } from "@/components/ui/button";
import { User } from "@clerk/nextjs/server";
import { Badge } from "@/components/ui/badge";

export default function UserInfo({ user }: { user: User | null }) {
  const role = user?.privateMetadata.role;
  return (
    <div className="flex items-center text-left gap-4 hover:bg-accent hover:text-accent-foreground p-2 rounded-md text-sm">
      <Avatar className="size-12">
        <AvatarImage
          src={user?.imageUrl}
          alt={`${user?.firstName} ${user?.lastName}`}
        />
        <AvatarFallback className="bg-primary text-white">
          {user?.firstName} {user?.lastName}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        {user?.firstName} {user?.lastName}
        <span className="text-muted-foreground">
          {user?.emailAddresses[0].emailAddress}
        </span>
        <span className="w-fit mt-1">
          <Badge variant="secondary" className="capitalize">
            {role?.toLowerCase()} Dashboard
          </Badge>
        </span>
      </div>
    </div>
  );
}
