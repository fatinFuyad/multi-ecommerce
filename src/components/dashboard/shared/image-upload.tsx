import { CloudUpload } from "lucide-react";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { useEffect, useState } from "react";

interface ImageUploadProps {
  disabled?: boolean; // The component will be disabled while isLoading;
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
  value: string[];
  type: "standard" | "profile" | "cover";
  dontShowPreview?: boolean;
  // cloudinaryKey: string;
}

function ImageUpload({
  disabled,
  onChange,
  onRemove,
  value,
  type,
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
  if (type !== "profile") return <div>Not profile image type</div>;
  return (
    <div
      style={{ pointerEvents: "auto" }}
      className="relative rounded-full w-52 h-52 bg-gray-200 border-2 border-white shadow-2xl overflow-visible"
    >
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

      {/* <Button
        asChild
        className="absolute bottom-6 right-0 rounded-3xl"
        size="icon"
      >
        <CldUploadButton uploadPreset="ecomimg493dk" onSuccess={handleUpload}>
          <UploadCloud />
        </CldUploadButton>
      </Button> */}

      {/* process is unavailable on the client, so we can pass it from a server component or create a function executes on the server and get the preset */}
      <CldUploadWidget
        uploadPreset={"ecomimg493dk"}
        onSuccess={handleUpload}
        onClose={() => {
          // Restore the pointer events (adjust as needed)
          document.body.style.pointerEvents = "none";
        }}
      >
        {({ open }) => {
          const onClick = () => {
            document.body.style.pointerEvents = "auto";
            open();
          };

          return (
            <>
              <button
                type="button"
                className="z-20 absolute right-0 bottom-6 flex items-center font-medium text-[17px] h-14 w-14 justify-center text-white bg-gradient-to-t from-blue-500 to-blue-300 border-none shadow-lg rounded-full hover:shadow-md active:shadow-sm"
                disabled={disabled}
                onClick={onClick}
              >
                <CloudUpload />
              </button>
            </>
          );
        }}
      </CldUploadWidget>
    </div>
  );
}

export default ImageUpload;
