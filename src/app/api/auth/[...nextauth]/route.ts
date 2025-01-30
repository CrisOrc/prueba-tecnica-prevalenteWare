import NextAuth from "next-auth";
import { authOptions } from "../../../../lib/auth";

/**
 * Handler for NextAuth authentication.
 *
 * This handler uses the configuration provided in `authOptions` to manage authentication.
 */
const handler = NextAuth(authOptions);

/**
 * Exporting the handler for both GET and POST methods.
 *
 * NextAuth uses these methods to handle session and callbacks.
 */
export { handler as GET, handler as POST };
