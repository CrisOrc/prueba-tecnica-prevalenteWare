import Link from "next/link";
import React from "react";
import { Card, CardContent } from "../ui/card";
import { useSession } from "next-auth/react";

/**
 * HomeCards Component
 *
 * Displays different cards based on the user's session.
 * If the user is an admin, additional cards for user management and reports are shown.
 *
 * @component
 * @example
 * return (
 *   <HomeCards />
 * )
 */
function HomeCards() {
  const { data: session } = useSession();

  return (
    <div className="flex flex-row items-center justify-center gap-4 w-full">
      <Link href="/transactions">
        <Card className="p-6 w-64 h-40 flex items-center justify-center text-center transition cursor-pointer">
          <CardContent>Gestión de ingresos y egresos</CardContent>
        </Card>
      </Link>

      {session?.user?.role === "ADMIN" && (
        <>
          <Link href="/users">
            <Card className="p-6 w-64 h-40 flex items-center justify-center text-center transition cursor-pointer">
              <CardContent>Gestion de usuarios</CardContent>
            </Card>
          </Link>

          <Link href="/reports">
            <Card className="p-6 w-64 h-40 flex items-center justify-center text-center transition cursor-pointer">
              <CardContent>Reportes</CardContent>
            </Card>
          </Link>
        </>
      )}
    </div>
  );
}

export default HomeCards;
