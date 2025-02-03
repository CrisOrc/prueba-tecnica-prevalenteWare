import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { typeDefs } from "@/graphql/typeDef";
import { resolvers } from "@/graphql/resolvers";
import { GraphQLContext } from "@/graphql/resolvers.types";
import { PrismaClient } from "@prisma/client";

/**
 * Creating an instance of ApolloServer with the provided type definitions and resolvers.
 */

const prisma = new PrismaClient();

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
const handler = startServerAndCreateNextHandler<NextRequest, GraphQLContext>(
  server,
  {
    context: async (): Promise<GraphQLContext> => {
      return {
        session: await getServerSession(authOptions),
        prisma,
      };
    },
  },
);

/**
 * Exporting the handler for both GET and POST methods.
 *
 * Next.js uses these methods to handle GraphQL requests.
 */
export async function POST(req: NextRequest) {
  return handler(req);
}

export async function GET(req: NextRequest) {
  return handler(req);
}
