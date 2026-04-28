import { Button } from "@/components/ui/button";
import { UploadCloud } from "lucide-react";
import {
  CldImageProps,
  CldUploadButton,
  CldUploadWidget,
  CldUploadWidgetProps
} from "next-cloudinary";
import Image from "next/image";
import { useEffect, useState } from "react";

interface ImageUploadProps {
  disabled?: boolean; // The component will be disabled while isLoading;
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
  value: string[];
  type: "standard" | "profile" | "cover";
  dontShowPreview?: boolean;
  cloudinaryKey: string;
}

function ImageUpload({
  disabled,
  onChange,
  onRemove,
  value,
  type,
  cloudinaryKey,
  dontShowPreview
}: ImageUploadProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleUpload = (result: any) => {
    console.log("Image upload result", result);
    onChange(result.info.secure_url);
  };

  if (!isMounted) return null; // prevents hydration issues & render only when it's mounted
  return (
    type === "profile" && (
      <div className="relative rounded-full w-52 h-52 inset-x-96 bg-gray-200 border-2 border-white shadow-2xl overflow-visible">
        {
          value.length > 0 && (
            <Image
              src={value[0]}
              alt="profile image"
              width={300}
              height={300}
              className="size-52 rounded-full absolute inset-0"
            />
          ) // better resolution to increase width & height and reduce from css
        }

        <Button
          asChild
          className="absolute bottom-6 right-0 rounded-3xl"
          size="icon"
        >
          <CldUploadButton
            uploadPreset={cloudinaryKey}
            onSuccess={handleUpload}
          >
            <UploadCloud />
          </CldUploadButton>
        </Button>

        {/* process is unavailable on the client, so we can pass it from a server component or create a function executes on the server and get the preset */}
        {/* <CldUploadWidget uploadPreset={cloudinaryKey} onSuccess={handleUpload}>
          {({ open }) => {
            const onClick = () => {
              open();
            };

            return (
              <>
                <button
                  type="button"
                  className="z-20 absolute right-0 bottom-6 flex items-center font-medium text-[17px] h-14 w-14 justify-center  text-white bg-gradient-to-t from-blue-primary to-blue-300 border-none shadow-lg rounded-full hover:shadow-md active:shadow-sm"
                  disabled={disabled}
                  onClick={onClick}
                > 
                  <svg
                    viewBox="0 0 640 512"
                    fill="white"
                    height="1em"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M144 480C64.5 480 0 415.5 0 336c0-62.8 40.2-116.2 96.2-135.9c-.1-2.7-.2-5.4-.2-8.1c0-88.4 71.6-160 160-160c59.3 0 111 32.2 138.7 80.2C409.9 102 428.3 96 448 96c53 0 96 43 96 96c0 12.2-2.3 23.8-6.4 34.6C596 238.4 640 290.1 640 352c0 70.7-57.3 128-128 128H144zm79-217c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l39-39V392c0 13.3 10.7 24 24 24s24-10.7 24-24V257.9l39 39c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-80-80c-9.4-9.4-24.6-9.4-33.9 0l-80 80z" />
                  </svg>
                </button>
              </>
            );
          }}
        </CldUploadWidget> */}
      </div>
    )
  );
}

export default ImageUpload;
