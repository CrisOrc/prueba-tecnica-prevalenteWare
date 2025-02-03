"use client";

import MovementsTable from "@/components/tables/MovementsTable";
import { useSession } from "next-auth/react";

/**
 * Transactions Page Component.
 *
 * This component handles the display and creation of financial movements.
 *
 * @returns {JSX.Element} The rendered Transactions Page component.
 */
export default function TransactionsPage() {
  const { data: session, status } = useSession();

  /**
   * Verifies the session status.
   *
   * @returns {JSX.Element | null} The loading or authentication message, or null.
   */
  if (status === "loading") {
    return <p>Loading session...</p>;
  }
  if (!session) {
    return <p>You are not authenticated. Please log in.</p>;
  }

  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <h1 className="text-3xl font-bold text-center p-10">Transacciones</h1>
      <MovementsTable />
    </div>
  );
}
