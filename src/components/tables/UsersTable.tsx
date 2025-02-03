"use client";

import { useQuery } from "@apollo/client";
import { GET_USERS } from "@/utils/users";
import { DataTable } from "@/components/ui/data-table";
import { DataTableRowActions } from "../ui/dataRowAction";

/**
 * Columns configuration for the DataTable component.
 * Defines the columns for the users table including actions.
 */
const columns = [
  { accessorKey: "name", header: "Nombre" },
  { accessorKey: "email", header: "Correo" },
  { accessorKey: "role", header: "Rol" },
  {
    id: "actions",
    cell: ({ row }: { row: unknown }) => <DataTableRowActions row={row} />,
  },
];

/**
 * UsersTable Component
 *
 * Displays a table of users with their name, email, role, and actions.
 * Fetches data using GraphQL and displays it in a DataTable component.
 *
 * @component
 * @example
 * return (
 *   <UsersTable />
 * )
 */
export default function UsersTable() {
  const { data, loading, error } = useQuery(GET_USERS);

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="flex flex-col items-center w-full h-full">
      <h1 className="text-3xl font-bold text-center p-10">Usuarios</h1>
      <DataTable columns={columns} data={data?.users || []} />;
    </div>
  );
}
