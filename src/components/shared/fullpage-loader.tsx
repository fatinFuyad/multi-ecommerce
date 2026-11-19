interface LoaderProps {
  loadingText?: string;
  isFullPage?: boolean;
  isBlurry?: boolean;
}

export default function FullPageLoader(loaderOptions: LoaderProps) {
  const {
    loadingText = "Loading...",
    isFullPage = false,
    isBlurry = false
  } = loaderOptions;

  const Loader = (
    <div className="mx-auto inset-0 z-10 flex flex-col items-center justify-center">
      <div className="relative h-16 w-16">
        <div className="absolute inset-0 rounded-full border-4 border-primary-shade" />
        <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-primary" />
      </div>
      <p className="mt-4 text-sm font-medium text-primary animate-pulse">{loadingText}</p>
    </div>
  );

  if (!isFullPage) return Loader;

  if (isFullPage && !isBlurry)
    return (
      <div className="w-full h-full fixed inset-0 z-10 flex flex-col items-center justify-center">
        {Loader}
      </div>
    );

  return (
    <div className="w-full h-full fixed inset-0 bg-muted-foreground/20 z-50 backdrop-blur-sm flex flex-col items-center justify-center">
      {Loader}
    </div>
  );
}
