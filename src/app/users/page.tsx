"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { redirect } from "next/navigation";
import UsersTable from "@/components/tables/UsersTable";
/**
 * Users Page Component.
 *
 * This component handles the display of users for admin users.
 * It fetches the list of users and displays them in a table.
 *
 * @returns {JSX.Element} The rendered Users Page component.
 */
export default function UsersPage() {
  const { data: session, status } = useSession();
  // Redirect if the user is not an admin
  useEffect(() => {
    if (status === "loading") return;

    if (!session || session == null) {
      redirect("/login");
    }

    if (session.user?.role !== "ADMIN") {
      redirect("/login"); // or wherever you prefer
    }
  }, [session, status]);

  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <UsersTable />
    </div>
  );
}
