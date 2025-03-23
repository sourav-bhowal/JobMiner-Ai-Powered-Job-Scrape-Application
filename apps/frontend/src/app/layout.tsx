import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "@repo/ui/globals.css";
import { Toaster } from "@workspace/ui/components/sonner";
import SessionContextProvider from "../context/SessionProvider";
import NavBar from "../components/shared/NavBar";

// Poppins is a Google Font that we are using in this example
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

// Metadata is a Next.js type that allows us to define metadata for the page
export const metadata: Metadata = {
  title: {
    template: "%s | JobNest",
    default: "JobNest",
  },
  description: "JobNest is an AI powered job recommendation platform",
};

// RootLayout is a layout component that wraps the entire application
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Session context provider is a wrapper component that provides the session context to the entire application
    <SessionContextProvider>
      <html lang="en" className="scroll-smooth">
        <body className={`${poppins.className} antialiased`}>
          <NavBar />
          {children}
          <Toaster /> {/* Toaster component from workspace/ui */}
        </body>
      </html>
    </SessionContextProvider>
  );
}
