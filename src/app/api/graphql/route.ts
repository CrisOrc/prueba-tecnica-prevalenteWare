import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { typeDefs } from "@/graphql/typeDef";
import { resolvers } from "@/graphql/resolvers";
import { NextApiHandler } from "next/types";

/**
 * Interface defining the context for Apollo Server.
 * Includes the session from Auth.js (NextAuth) to verify roles, etc.
 */
interface GraphQLContext {
  session: Awaited<ReturnType<typeof getServerSession>>;
}

/**
 * Creating an instance of ApolloServer with the provided type definitions and resolvers.
 */
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

/**
 * Handler to start the Apollo Server and create a Next.js handler.
 *
 * @param {NextRequest} req - The incoming request object.
 * @returns {Promise<GraphQLContext>} - The context including the session.
 */
export const handler = startServerAndCreateNextHandler<
  NextRequest,
  GraphQLContext
>(server, {
  context: async () => {
    const session = await getServerSession(authOptions);
    return { session };
  },
});

/**
 * Exporting the handler for both GET and POST methods.
 *
 * Next.js uses these methods to handle GraphQL requests.
 */
export const GET = handler as NextApiHandler;
export const POST = handler as NextApiHandler;
