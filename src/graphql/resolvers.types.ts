import { MovementType, Role, PrismaClient } from "@prisma/client";
import { User as NextAuthUser } from "next-auth";
import { Session as NextAuthSession } from "next-auth";

/**
 * Interface defining the context for GraphQL resolvers.
 *
 * @interface GraphQLContext
 * @property {Session | null} session - The session object, which can be null if the user is not authenticated.
 */

export interface GraphQLContext {
  session: CustomSession | null;
  prisma: PrismaClient;
}

export interface CustomSession extends NextAuthSession {
  id: string;
  userId: string;
  sessionToken: string;
  expires: string;
}

/**
 * Custom user type that includes the role property.
 */
export interface CustomUser extends NextAuthUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role: Role;
}

/**
 * Custom session type that includes the custom user type.
 */

export interface Movement {
  id: string;
  concept: string;
  amount: number;
  date: string;
  userId: string;
  user: CustomUser;
  type: MovementType;
}

/**
 * Interface defining the arguments for the createMovement mutation.
 *
 * @interface CreateMovementArgs
 * @property {string} concept - The concept or description of the movement.
 * @property {number} amount - The amount of the movement.
 * @property {string} userId - The ID of the user associated with the movement.
 * @property {string} date - The date of the movement.
 * @property {MovementType} type - The type of the movement (INCOME or EXPENSE).
 */
export interface CreateMovementArgs {
  concept: string;
  amount: number;
  userId: string;
  date: string;
  type: MovementType;
}

/**
 * Interface defining the arguments for the updateUser mutation.
 *
 * @interface UpdateUserArgs
 * @property {string} id - The ID of the user to update.
 * @property {string} [name] - The updated name of the user.
 * @property {Role} [role] - The updated role of the user.
 */
export interface UpdateUserArgs {
  id: string;
  name?: string;
  role?: Role;
}
