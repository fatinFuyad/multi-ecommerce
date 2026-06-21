import StoreDetails from "@/components/dashboard/forms/store-details";

function NewStorePage() {
  return (
    <div className="grid gap-6 p-8">
      <h1 className="text-4xl text-cyan-400">New Store Page</h1>
      <h3>Welcome Seller, start creating your store</h3>

      <StoreDetails />
    </div>
  );
}

export default NewStorePage;
