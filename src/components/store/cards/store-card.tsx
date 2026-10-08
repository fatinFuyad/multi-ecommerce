"use client";

import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { IStore } from "@/models/Store";
import { checkUserFollowingStore, followStore } from "@/services/user";
import { Check, MessageSquareMore, Plus } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FC, useEffect, useState } from "react";

interface Props {
  store: Pick<IStore, "_id" | "url" | "name" | "logo" | "followers">;
}

const StoreCard: FC<Props> = ({ store }) => {
  const session = useSession();
  const router = useRouter();
  const { toast } = useToast();

  const { _id, name, logo, url, followers } = store;
  const [following, setFollowing] = useState<string | null>(null);

  // update the followers count with state instead of refetching or refreshing the page;
  const [storeFollowersCount, setStoreFollowersCount] = useState<number>(followers);

  useEffect(() => {
    if (!session || !session.data?.user) return;
    checkUserFollowingStore(store._id, session.data.user._id).then((followRes) => {
      setFollowing(followRes._id);
    });
  }, [session, store._id]);

  const handleStoreFollow = async () => {
    if (session.status !== "loading" && session.status === "unauthenticated")
      router.push("/signin");
    try {
      const followRes = await followStore(_id, following);
      setFollowing(followRes._id);

      if (followRes._id) {
        setStoreFollowersCount((prev) => prev + 1);
        toast({
          description: `You are now following ${name}`
        });
      }
      if (!followRes._id) {
        setStoreFollowersCount((prev) => prev - 1);
        toast({
          description: `You unfollowed ${name}`
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message
      });
    }
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
              <Link href={`/store/${url}`} className="text-primary">
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
