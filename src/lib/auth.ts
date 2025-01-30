import NextAuth, { AuthOptions, Session } from "next-auth";
import Auth0Provider from "next-auth/providers/auth0";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { AdapterUser } from "next-auth/adapters";

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
        token.role = user.role; // This line might cause an error if 'role' doesn't exist on 'user'
      }
      return token;
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
