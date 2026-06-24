import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Badge } from "@/components/ui/badge";

export default function UserInfo({ user }: { user: any }) {
  return (
    <div className="flex items-center text-left gap-4 hover:bg-accent hover:text-accent-foreground p-2 rounded-md text-sm">
      <Avatar className="size-12">
        <AvatarImage src={user.image} alt={user.name} />
        <AvatarFallback className="bg-primary text-white">
          {user.name}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        {user.name}
        <span className="text-muted-foreground">{user.email}</span>
        <span className="w-fit mt-1">
          <Badge variant="secondary" className="capitalize">
            {user?.role.toLowerCase()} Dashboard
          </Badge>
        </span>
      </div>
    </div>
  );
}
