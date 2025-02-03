import NextAuth, { AuthOptions, Session } from "next-auth";
import Auth0Provider from "next-auth/providers/auth0";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { AdapterUser } from "next-auth/adapters";
import { Role } from "@prisma/client";

declare module "next-auth" {
  interface User {
    role: Role;
  }

  interface Session {
    user: User;
  }
}

/**
 * Authentication options for NextAuth.
 *
 * This configuration includes the Prisma adapter for database connection,
 * Auth0 as the authentication provider, session management, and custom callbacks.
 *
 * @type {AuthOptions}
 */
export const authOptions: AuthOptions = {
  // Using Prisma adapter to connect to the database
  adapter: PrismaAdapter(prisma),
  providers: [
    // Configuring Auth0 as the authentication provider
    Auth0Provider({
      clientId: process.env.AUTH0_CLIENT_ID!,
      clientSecret: process.env.AUTH0_CLIENT_SECRET!,
      issuer: process.env.AUTH0_ISSUER!,
      authorization: {
        params: {
          prompt: "login select_account",
        },
      },
    }),
  ],
  session: {
    // Storing session data in the database
    strategy: "database",
  },

  callbacks: {
    /**
     * Callback to handle session data.
     * Adds user id and role to the session object.
     *
     * @param {Object} params - The parameters object.
     * @param {Session} params.session - The session object.
     * @param {AdapterUser} params.user - The user object.
     * @returns {Promise<Session>} The modified session object.
     */
    async session({ session, user }: { session: Session; user: AdapterUser }) {
      // Adding user id and role to the session object
      if (session.user) {
        session.user.id = user.id;
        session.user.role = user.role; // This line might cause an error if 'role' doesn't exist on 'user'
      }
      return session;
    },

    /**
     * Callback to handle JWT token.
     * Adds user id and role to the token object.
     *
     * @param {Object} params - The parameters object.
     * @param {Object} params.token - The token object.
     * @param {AdapterUser} params.user - The user object.
     * @returns {Promise<Object>} The modified token object.
     */
    async jwt({ token, user }) {
      // Adding user id and role to the token object
      if (user) {
        token.id = user.id;
        token.role = user.role || "USER"; // This line might cause an error if 'role' doesn't exist on 'user'
      }
      return token;
    },

    /**
     * Handles user sign-in process.
     *
     * @param {Object} params - The parameters for the sign-in function.
     * @param {Object} params.user - The user object from the authentication provider.
     * @param {Object} params.account - The account object from the authentication provider.
     * @returns {Promise<boolean>} - Returns true if the sign-in process is successful.
     */
    async signIn({ user, account }) {
      if (account?.provider === "auth0") {
        // Buscar si el usuario ya existe en la DB
        let existingUser = await prisma.user.findUnique({
          where: { email: user.email as string }, // Type assertion to avoid TypeScript error
        });

        // Si el usuario no existe, lo creamos
        if (!existingUser) {
          existingUser = await prisma.user.create({
            data: {
              email: user.email as string, // Type assertion to avoid TypeScript error
              name: user.name,
              image: user.image,
              role: "USER", // O asignar un rol por defecto
            },
          });
        }
      }
      return true;
    },
  },
  // Secret needed to sign the tokens
  secret: process.env.NEXTAUTH_SECRET,
};

/**
 * Default export for NextAuth configuration.
 *
 * This export initializes NextAuth with the provided authentication options.
 */
export default NextAuth(authOptions);
