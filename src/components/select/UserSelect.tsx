"use client";

import { useQuery } from "@apollo/client";
import { GET_USERS } from "@/utils/users";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/**
 * UserSelect Component
 *
 * A dropdown to select a user for an income/expense movement.
 *
 * @param {Object} props - The component props.
 * @param {string} props.value - The selected user ID.
 * @param {(value: string) => void} props.onChange - Function to handle user selection.
 * @returns {JSX.Element} The rendered component.
 */
export function UserSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const { data, loading, error } = useQuery(GET_USERS);

  if (loading) return <p>Cargando usuarios...</p>;
  if (error) return <p>Error al cargar los usuarios</p>;

  return (
    <Select onValueChange={onChange} defaultValue={value}>
      <SelectTrigger>
        <SelectValue placeholder="Seleccionar usuario" />
      </SelectTrigger>
      <SelectContent>
        {data?.users?.map((user: { id: string; name: string }) => (
          <SelectItem key={user.id} value={user.id}>
            {user.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
