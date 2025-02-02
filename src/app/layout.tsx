"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SessionProvider, useSession } from "next-auth/react";
import { ApolloProvider } from "@apollo/client";
import { apolloClient } from "@/lib/apollo-client";
import Navbar from "@/components/navbar/Navbar";
import { ReactNode, useEffect } from "react";

/**
 * Importing the Geist font from Google Fonts.
 * This font is used for the main text in the application.
 */
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

/**
 * Importing the Geist Mono font from Google Fonts.
 * This font is used for monospaced text in the application.
 */
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/**
 * ProtectedLayout Component.
 * Redirects unauthenticated users to the login page.
 *
 * @param {Object} props - The component props.
 * @param {ReactNode} props.children - The child components to render.
 * @returns {JSX.Element} The rendered component.
 */
function ProtectedLayout({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading") return;
  }, [session, status]);

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Cargando...</p>
      </div>
    );
  }

  return (
    <div className="flex">
      <main className="h-screen w-screen">{children}</main>
    </div>
  );
}

/**
 * RootLayout Component.
 * This component wraps the entire application with necessary providers and global styles.
 *
 * @param {Object} props - The component props.
 * @param {ReactNode} props.children - The child components to render.
 * @returns {JSX.Element} The rendered component.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <SessionProvider>
      <ApolloProvider client={apolloClient}>
        <html lang="en">
          <head>
            <title>FinFlow - Gestión Financiera</title>
          </head>
          <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
          >
            <ProtectedLayout>
              <div className="flex">
                <Navbar />
                <main className="h-screen w-screen justify-center items-center">
                  {children}
                </main>
              </div>
            </ProtectedLayout>
          </body>
        </html>
      </ApolloProvider>
    </SessionProvider>
  );
}
