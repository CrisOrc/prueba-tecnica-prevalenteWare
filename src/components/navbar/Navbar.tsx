"use client";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { Button } from "../ui/button";

/**
 * Navbar component that displays navigation links and user-specific options.
 *
 * @returns {JSX.Element} The rendered Navbar component.
 */
export default function Navbar() {
  const { data: session } = useSession();

  /**
   * Handles the logout action.
   */
  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <>
      {session && (
        <nav className="flex flex-col w-64 min-h-screen p-5 shadow-lg shadow-gray-300 items-center">
          <NavigationMenu className="flex flex-col space-y-4 h-full justify-between items-center">
            <NavigationMenuList className="flex flex-col space-y-2 gap-4">
              <NavigationMenuList>
                <Link href="/home" className="text-xl font-bold">
                  FinFlow
                </Link>
              </NavigationMenuList>
              <NavigationMenuItem>
                <Link href="/transactions" passHref>
                  Ingresos y Egresos
                </Link>
              </NavigationMenuItem>
              {session.user?.role == "ADMIN" && (
                <>
                  <NavigationMenuItem>
                    <Link href="/users" passHref>
                      Usuarios
                    </Link>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <Link href="/reports" passHref>
                      Reportes
                    </Link>
                  </NavigationMenuItem>
                </>
              )}
            </NavigationMenuList>
            <div className="mt-auto flex flex-col space-y-4 w-full">
              <Button onClick={handleLogout} className="rounded">
                Cerrar sesión
              </Button>
            </div>
          </NavigationMenu>
        </nav>
      )}
    </>
  );
}
