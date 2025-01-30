import { Session } from "@prisma/client";

/**
 * Interface defining the context for GraphQL resolvers.
 *
 * @property {Session | null} session - The session object, which can be null if the user is not authenticated.
 */
export interface GraphQLContext {
  session: Session | null;
}

/**
 * Interface defining the arguments for the createMovement mutation.
 *
 * @property {string} concept - The concept or description of the movement.
 * @property {number} amount - The amount of the movement.
 */
export interface CreateMovementArgs {
  concept: string;
  amount: number;
}
