import { SendIcon } from "@/components/store/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Newsletter() {
  return (
    <div className="bg-gradient-to-r from-primary-light to-primary-shade p-5">
      <div className="max-w-[1430px] mx-auto">
        <div className="flex flex-col gap-y-4 xl:flex-row items-center text-secondary-foreground">
          {/* Left */}
          <div className="flex items-center xl:w-[58%]">
            <h5 className="flex items-center gap-x-2">
              <div className="scale-125 mr-2 text-primary">
                <SendIcon />
              </div>
              <span className="md:text-xl">Sign up to Newsletter</span>
              <span className="ml-10">
                ...and receive &nbsp;
                <b>$10 coupon for first shopping</b>
              </span>
            </h5>
          </div>
          {/* Right */}
          <div className="flex w-full xl:flex-1 gap-2">
            <Input
              type="text"
              placeholder="Enter your email address"
              className="bg-background/50 border-primary"
            />
            <Button variant="default">Sign Up</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
