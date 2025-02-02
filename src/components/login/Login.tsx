"use client";

import { signIn, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

/**
 * LoginPage Component
 *
 * This component handles the login functionality. It signs out the user on mount
 * and provides a button to sign in using Auth0.
 *
 * @component
 * @example
 * return (
 *   <LoginPage />
 * )
 */
export default function LoginPage() {
  useEffect(() => {
    signOut({ redirect: false });
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="p-10 shadow-md rounded-lg w-96 text-center">
        <h2 className="text-2xl font-bold mb-6">Iniciar sesión</h2>
        <Button
          className="w-full text-white p-3 rounded-md"
          onClick={() =>
            signIn("auth0", { callbackUrl: "/home" }, { prompt: "login" })
          }
        >
          Iniciar sesión con Auth0
        </Button>
      </div>
    </div>
  );
}
