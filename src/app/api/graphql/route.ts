import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { typeDefs } from "@/graphql/typeDef";
import { resolvers } from "@/graphql/resolvers";
import { Session } from "@prisma/client";
import { prisma } from "@/lib/prisma";

// Create an instance of ApolloServer with the provided type definitions and resolvers
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Handler to start the Apollo Server and create a Next.js handler
const handler = startServerAndCreateNextHandler(server, {
  context: async () => {
    const session: Session | null = await getServerSession(authOptions);
    return { session, prisma };
  },
});

// Exporting the handler for both GET and POST methods
export { handler as GET, handler as POST };
