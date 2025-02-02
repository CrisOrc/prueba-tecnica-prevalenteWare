"use client";

import "./globals.css";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

/**
 * Home Component
 *
 * This component checks the user's session status and redirects accordingly.
 * If the user is not authenticated, they are redirected to the login page.
 * If the user is authenticated, they are redirected to the home page.
 *
 * @component
 * @example
 * return (
 *   <Home />
 * )
 */
export default function Home() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (!session) {
      redirect("/login");
    }

    if (session) {
      redirect("/home");
    }
  }, [session, status]);

  return <main></main>;
}
