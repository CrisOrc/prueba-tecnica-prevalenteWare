"use client";

import EditUserForm from "@/components/forms/EditUserForm";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect } from "react";

/**
 * EditUserPage Component
 *
 * This component renders a form to edit a user's details. It checks if the user is authenticated
 * and if they have admin privileges. If not, it redirects to the login page.
 *
 * @component
 * @example
 * return (
 *   <EditUserPage />
 * )
 */
function EditUserPage() {
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
      <EditUserForm />
    </div>
  );
}

export default EditUserPage;
