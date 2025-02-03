"use client";

import { useQuery } from "@apollo/client";
import { GET_MOVEMENTS } from "@/utils/movements";
import { DataTable } from "@/components/ui/data-table";
import { useSession } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Movement, User } from "@prisma/client";

/**
 * Formats a number as currency with thousand separators and a dollar sign.
 *
 * @param {number} value - The value to format.
 * @returns {string} The formatted currency string.
 */
const formatCurrency = (value: number): string => {
  return `$${value.toLocaleString("es-CO")}`;
};

/**
 * MovementsTable Component
 *
 * Displays a paginated table of all income and expense movements.
 * Fetches data using GraphQL and displays actions for each movement.
 *
 * @component
 * @example
 * return (
 *   <MovementsTable />
 * )
 */
export default function MovementsTable() {
  const { data, loading, error } = useQuery(GET_MOVEMENTS);
  const { data: session } = useSession();
  const userRole = (session?.user as User)?.role;
  const userId = (session?.user as User)?.id;

  // Filter movements based on user role
  const movements =
    userRole === "ADMIN"
      ? data?.movements || []
      : data?.movements?.filter((m: Movement) => m.user.id === userId) || [];

  // Calculate totals based on filtered movements
  const totalIncome =
    movements
      ?.filter((m: Movement) => m.type === "INCOME")
      ?.reduce((acc: number, m: Movement) => acc + Number(m.amount), 0) || 0;

  const totalExpense =
    movements
      ?.filter((m: Movement) => m.type === "EXPENSE")
      ?.reduce((acc: number, m: Movement) => acc + Number(m.amount), 0) || 0;

  const totalBalance = totalIncome - totalExpense;

  // Define columns dynamically
  const columns = [
    { accessorKey: "concept", header: "Concepto" },
    {
      accessorKey: "amount",
      header: "Monto",
      cell: ({ row }: { row: unknown }) => {
        const amount = Number(row.getValue("amount"));
        const type = row.original.type; // "INCOME" or "EXPENSE"

        // Format amount with sign and corresponding color
        const formattedAmount = formatCurrency(amount);
        return (
          <span
            className={type === "INCOME" ? "text-green-500" : "text-red-500"}
          >
            {type === "INCOME" ? `+${formattedAmount}` : `-${formattedAmount}`}
          </span>
        );
      },
    },
    {
      accessorKey: "date",
      header: "Fecha",
      cell: ({ row }: { row: unknown }) => {
        const dateValue = row.getValue("date");
        if (!dateValue) return "Sin fecha";
        return new Date(Number(dateValue)).toLocaleDateString("es-ES", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });
      },
    },
    // Show "User" column only if the user is ADMIN
    ...(userRole === "ADMIN"
      ? [{ accessorKey: "user.name", header: "Usuario" }]
      : []),
  ];

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="flex flex-col items-center w-full h-full">
      <DataTable columns={columns} data={movements} button />

      <div className="mt-6 w-full max-w-lg flex flex-col gap-2">
        <label className="text-sm font-semibold">Total Ingresos</label>
        <Input
          disabled
          value={`+${formatCurrency(totalIncome)}`}
          className="text-green-600 font-medium"
        />

        <label className="text-sm font-semibold">Total Egresos</label>
        <Input
          disabled
          value={`-${formatCurrency(totalExpense)}`}
          className="text-red-600 font-medium"
        />

        <label className="text-sm font-semibold">Balance General</label>
        <Input
          disabled
          value={formatCurrency(totalBalance)}
          className={`font-bold ${
            totalBalance >= 0 ? "text-green-700" : "text-red-700"
          }`}
        />
      </div>
    </div>
  );
}
