import { Toaster } from "@/components/ui/toaster";
import AuthProvider from "@/providers/AuthProvider";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Barlow, Inter } from "next/font/google";
import ModalProvider from "../providers/modal-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "MultiEcom",
  description:
    "Welcome to MultiEcom, your ultimate destination for seamless online shopping! Discover a vast array of products from trusted sellers, all in one convenient marketplace. With MultiEcom, shopping is made easy, fast, and enjoyable. Find everything you need, from fashion and electronics to home essentials, and experience the joy of hassle-free online shopping. Start exploring today!"
};

const interFont = Inter({
  weight: ["500", "700"],
  subsets: ["latin"],
  variable: "--font-inter"
});

const barlowFont = Barlow({
  weight: ["500", "700"],
  subsets: ["latin"],
  variable: "--font-barlow"
});

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={`${interFont.className} ${barlowFont.variable} antialiased`}
      >
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <ModalProvider>{children}</ModalProvider>
            <Toaster />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
