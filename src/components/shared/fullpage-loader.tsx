interface LoaderProps {
  loadingText?: string;
}
export default function FullPageLoader({ loadingText }: LoaderProps) {
  return (
    <div className="mx-auto inset-0 z-10 flex flex-col items-center justify-center">
      <div className="relative h-16 w-16">
        <div className="absolute inset-0 rounded-full border-4 border-primary-shade" />
        <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-primary" />
      </div>

      <p className="mt-4 text-sm font-medium text-primary animate-pulse">
        {loadingText ? loadingText : "Loading..."}
      </p>
    </div>
  );
}
