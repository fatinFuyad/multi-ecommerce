import SignupForm from "./signup-form";

function SignupPage() {
  return (
    <div className="w-full md:w-1/2 mx-auto p-6 grid gap-6">
      <h1 className="text-4xl text-blue-500">Sign up Page</h1>
      <SignupForm />
    </div>
  );
}

export default SignupPage;
