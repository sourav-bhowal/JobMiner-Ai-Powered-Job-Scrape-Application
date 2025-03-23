"use client";
import { SessionProvider } from "next-auth/react";

// SessionContextProvider is a wrapper component that provides the session context to the entire application
export default function SessionContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SessionProvider>{children}</SessionProvider>;
}
