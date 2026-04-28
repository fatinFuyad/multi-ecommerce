import CategoryDetails from "@/components/dashboard/forms/category-details";

export default function AdminNewCategoryPage() {
  const cloudinaryPreset = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_PRESET;
  if (!cloudinaryPreset) return null;
  return (
    <div className="w-full">
      <CategoryDetails cloudinaryKey={cloudinaryPreset} />
    </div>
  );
}
