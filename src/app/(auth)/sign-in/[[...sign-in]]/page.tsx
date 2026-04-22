import { SignIn } from "@clerk/nextjs";

function page() {
  return (
    <div className="h-screen grid items-center justify-center">
      <SignIn />
    </div>
  );
}

export default page;
