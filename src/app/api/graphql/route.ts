import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { typeDefs } from "@/graphql/typeDef";
import { resolvers } from "@/graphql/resolvers";
import { Session } from "@prisma/client";

// Define the GraphQL context type
interface GraphQLContext {
  session: Session | null;
}

// Create an instance of ApolloServer with the provided type definitions and resolvers
const server = new ApolloServer<GraphQLContext>({
  typeDefs,
  resolvers,
});

// Handler to start the Apollo Server and create a Next.js handler
const handler = startServerAndCreateNextHandler<NextRequest, GraphQLContext>(
  server,
  {
    context: async () => {
      const nextAuthSession = await getServerSession(authOptions);
      const session: Session | null = nextAuthSession
        ? {
            id: nextAuthSession.id,
            userId: nextAuthSession.userId,
            sessionToken: nextAuthSession.sessionToken,
            expires: nextAuthSession.expires.toISOString(),
          }
        : null;
      return { session };
    },
  },
);

// Exporting the handler for both GET and POST methods
export async function POST(req: NextRequest) {
  return handler(req);
}

export async function GET(req: NextRequest) {
  return handler(req);
}
