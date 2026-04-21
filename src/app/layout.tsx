import { ThemeProvider } from "@/components/shared/theme-provider";
import type { Metadata } from "next";
import "./globals.css";
import { Inter, Barlow } from "next/font/google";

export const metadata: Metadata = {
  title: "NextEcom",
  description:
    "Welcome to NextEcom, your ultimate destination for seamless online shopping! Discover a vast array of products from trusted sellers, all in one convenient marketplace. With NextEcom, shopping is made easy, fast, and enjoyable. Find everything you need, from fashion and electronics to home essentials, and experience the joy of hassle-free online shopping. Start exploring today!"
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
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
