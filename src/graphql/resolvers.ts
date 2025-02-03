import { prisma } from "@/lib/prisma";
import { CreateMovementArgs, GraphQLContext } from "./resolvers.types";
import { Movement, Role, Session } from "@prisma/client";
import { User } from "next-auth";

declare module "next-auth" {
  interface User {
    role: Role;
  }

  interface Session {
    user: User;
  }
}

declare module "@/graphql/resolvers.types" {
  interface context {
    session: Session | null;
  }
  interface session {
    user: User | null;
  }
}

/**
 * GraphQL resolvers for handling queries and mutations.
 */
export const resolvers = {
  Query: {
    /**
     * Retrieves all movements from the database.
     * Available to all authenticated users.
     *
     * @param {unknown} _parent - The parent resolver.
     * @param {unknown} _args - The arguments for the resolver.
     * @param {GraphQLContext} context - The context containing the session.
     * @returns {Promise<Movement[]>} The list of movements.
     * @throws {Error} If the user is not authenticated.
     */
    movements: async (
      _parent: unknown,
      _args: unknown,
      context: GraphQLContext,
    ): Promise<Movement[]> => {
      if (!context.session) {
        throw new Error("No autenticado");
      }

      return prisma.movement.findMany({
        include: { user: true },
      });
    },

    /**
     * Retrieves all users from the database.
     * Requires ADMIN role.
     *
     * @param {unknown} _parent - The parent resolver.
     * @param {unknown} _args - The arguments for the resolver.
     * @param {GraphQLContext} context - The context containing the session.
     * @returns {Promise<User[]>} The list of users.
     * @throws {Error} If the user is not authenticated or not an admin.
     */
    users: async (
      _parent: unknown,
      _args: unknown,
      context: GraphQLContext,
    ): Promise<User[]> => {
      if (!context.session) {
        throw new Error("Not authenticated");
      }
      if (context.session.user.role !== "ADMIN") {
        throw new Error("Access denied. ADMIN role required.");
      }
      return prisma.user.findMany();
    },

    /**
     * Retrieves a user by ID.
     * Requires ADMIN role.
     *
     * @param {unknown} _parent - The parent resolver.
     * @param {object} args - The arguments for the resolver.
     * @param {string} args.id - The ID of the user to fetch.
     * @param {GraphQLContext} context - The context containing the session.
     * @returns {Promise<User | null>} The user object if found, otherwise null.
     * @throws {Error} If the user is not authenticated or not an admin.
     */
    user: async (
      _parent: unknown,
      args: { id: string },
      context: GraphQLContext,
    ): Promise<User | null> => {
      if (!context.session) {
        throw new Error("Not authenticated");
      }

      if (context.session.user.role !== "ADMIN") {
        throw new Error("Access denied. ADMIN role required.");
      }

      return prisma.user.findUnique({
        where: { id: args.id },
      });
    },
  },

  Mutation: {
    /**
     * Creates a new financial movement.
     * Only accessible by ADMIN role.
     *
     * @param {unknown} _parent - The parent resolver.
     * @param {object} args - The arguments for creating a movement.
     * @param {CreateMovementArgs} args.input - The input data for the movement.
     * @param {GraphQLContext} context - The context containing the session.
     * @returns {Promise<Movement>} The created movement.
     * @throws {Error} If the user is not authenticated or not an admin.
     */
    createMovement: async (
      _parent: unknown,
      { input }: { input: CreateMovementArgs },
      context: GraphQLContext,
    ): Promise<Movement> => {
      if (!context.session) {
        throw new Error("No autenticado");
      }

      if (context.session.user.role !== "ADMIN") {
        throw new Error("Solo un ADMIN puede crear movimientos.");
      }

      return prisma.movement.create({
        data: {
          concept: input.concept,
          amount: Number(input.amount),
          date: new Date(input.date),
          userId: input.userId,
          type: input.type,
        },
      });
    },

    /**
     * Updates a user's information.
     * Requires ADMIN role.
     *
     * @param {unknown} _parent - The parent resolver.
     * @param {object} args - The arguments for updating a user.
     * @param {string} args.id - The ID of the user to update.
     * @param {UpdateUserArgs} args.input - The updated user data.
     * @param {GraphQLContext} context - The context containing the session.
     * @returns {Promise<User>} The updated user object.
     * @throws {Error} If the user is not authenticated or not an admin.
     */
    updateUser: async (
      _parent: unknown,
      { id, input }: { id: string; input: { name?: string; role?: Role } },
      context: GraphQLContext,
    ): Promise<User> => {
      if (!context.session) {
        throw new Error("Not authenticated");
      }

      if (context.session.user.role !== "ADMIN") {
        throw new Error("Access denied. ADMIN role required.");
      }

      return prisma.user.update({
        where: { id },
        data: {
          name: input.name,
          role: input.role,
        },
      });
    },
  },

  Movement: {
    /**
     * Retrieves the user associated with a movement.
     *
     * @param {Movement} parent - The current movement.
     * @returns {Promise<User | null>} The associated user.
     */
    user: async (parent: Movement): Promise<User | null> => {
      return prisma.user.findUnique({
        where: { id: parent.userId },
      });
    },
  },

  User: {
    /**
     * Retrieves the movements associated with a user.
     *
     * @param {object} parent - The current user.
     * @param {string} parent.id - The ID of the user.
     * @returns {Promise<Movement[]>} The list of movements associated with the user.
     */
    movements: async (parent: { id: string }): Promise<Movement[]> => {
      return prisma.movement.findMany({
        where: { userId: parent.id },
      });
    },
  },
};
