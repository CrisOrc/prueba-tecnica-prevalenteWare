"use client";

import { useSession } from "next-auth/react";
import { gql, useQuery } from "@apollo/client";
import { useEffect } from "react";
import { redirect } from "next/navigation";
import { User } from "@prisma/client";

/**
 * GraphQL query to fetch all users.
 */
const GET_USERS = gql`
  query Users {
    users {
      id
      name
      email
      role
    }
  }
`;

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

  // Fetch users only if the session is loaded and the user is an admin
  const { data, loading, error } = useQuery(GET_USERS, {
    skip: status === "loading" || !session || session.user?.role !== "ADMIN",
  });

  // Redirect if the user is not an admin
  useEffect(() => {
    if (status === "loading") return;

    if (!session || session == null) {
      redirect("/");
    }

    if (session.user?.role !== "ADMIN") {
      redirect("/"); // or wherever you prefer
    }
  }, [session, status]);

  if (status === "loading") {
    return <p>Loading session...</p>;
  }

  if (!session || session.user?.role !== "ADMIN") {
    return null; // This case is handled by the effect that redirects
  }

  if (loading) return <p>Loading users...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div style={{ padding: "1rem" }}>
      <h1>User Management (Admin Only)</h1>
      <table border={1} cellPadding={4}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {data.users.map((u: User) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
