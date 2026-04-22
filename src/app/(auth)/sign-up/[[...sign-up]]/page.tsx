import { SignUp } from "@clerk/nextjs";

function page() {
  return (
    <div className="h-screen grid items-center justify-center  mt-10">
      <SignUp />
    </div>
  );
}

export default page;
