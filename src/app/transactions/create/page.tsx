"use client";

import CreateMovementForm from "@/components/forms/AddMovementForm";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect } from "react";

/**
 * CreateMovement Component
 *
 * This component renders a form to create a new movement. It checks if the user is an admin
 * and redirects to the login page if the user is not authenticated or not an admin.
 *
 * @component
 * @example
 * return (
 *   <CreateMovement />
 * )
 */
function CreateMovement() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading") return;

    if (!session || session == null) {
      redirect("/login");
    }

    if ((session.user as any)?.role !== "ADMIN") {
      redirect("/login"); // or wherever you prefer
    }
  }, [session, status]);

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen">
      <CreateMovementForm />
    </div>
  );
}

export default CreateMovement;
