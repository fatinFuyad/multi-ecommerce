// params: { storeUrl: [ 'easy-sports', 'products' ] }
function SellerStorePage() {
  return (
    <div className="grid gap-6 p-8">
      <h1 className="text-4xl text-cyan-400">Seller store page,</h1>
      <h3>Welcome Seller, start managing</h3>
      <p>
        This is the protected SELLER dashboard restricted to users with the
        `SELLER` Role.
      </p>
    </div>
  );
}

export default SellerStorePage;
