"use client";

import { cn } from "@/lib/utils";
import { IStore } from "@/models/Store";
import { Check, MessageSquareMore, Plus } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FC, useState } from "react";

interface Props {
  store: Pick<IStore, "_id" | "url" | "name" | "logo"> & {
    followersCount: number;
    isUserFollowingStore: boolean;
  };
}

const StoreCard: FC<Props> = ({ store }) => {
  const { name, logo, url, followersCount, isUserFollowingStore } = store;
  const [following, setFollowing] = useState<boolean>(isUserFollowingStore);
  const [storeFollowersCount, setStoreFollowersCount] = useState<number>(followersCount);
  const session = useSession();
  const router = useRouter();

  const handleStoreFollow = async () => {
    if (session.status !== "loading" && session.status === "unauthenticated")
      router.push("/signin");
  };
  return (
    <div className="w-full">
      <div className="bg-card flex items-center justify-between rounded-xl py-3 px-4">
        <div className="flex">
          <Link href={`/store/${url}`}>
            <Image
              src={logo}
              alt={name}
              width={50}
              height={50}
              className="w-12 h-12 object-cover rounded-full"
            />
          </Link>
          <div className="mx-2">
            <div className="text-xl font-bold leading-6">
              <Link href={`/store/${url}`} className="text-main-primary">
                {name}
              </Link>
            </div>
            <div className="text-sm leading-5 mt-1">
              <strong>100%</strong>
              <span> Positive Feedback</span>&nbsp;|&nbsp;
              <strong>{storeFollowersCount}</strong>
              <strong> Followers</strong>
            </div>
          </div>
        </div>
        <div className="flex">
          <div
            className={cn(
              "flex items-center border border-card-foreground rounded-full cursor-pointer text-base font-bold h-9 mx-2 px-4 hover:bg-popover-foreground hover:text-secondary",
              {
                "bg-card-foreground text-secondary": following
              }
            )}
            onClick={() => handleStoreFollow()}
          >
            {following ? <Check className="w-4 me-1" /> : <Plus className="w-4 me-1" />}
            <span>{following ? "Following" : "Follow"}</span>
          </div>
          <div className="flex items-center border border-card-foreground rounded-full cursor-pointer text-base font-bold h-9 mx-2 px-4 bg-card-foreground text-popover">
            <MessageSquareMore className="w-4 me-2" />
            <span>Message</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreCard;
