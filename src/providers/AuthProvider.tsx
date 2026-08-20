"use client";

import { SessionProvider } from "next-auth/react";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider
      // Default base path if your app lives at the root "/"
      basePath="/"
      // Re-fetch session every 5 minutes
      refetchInterval={5 * 60}
      // Re-fetches session when window is focused
      refetchOnWindowFocus={false}
    >
      {children}
    </SessionProvider>
  );
}
