import { MovementType, Role, Session } from "@prisma/client";

/**
 * Interface defining the context for GraphQL resolvers.
 *
 * @interface GraphQLContext
 * @property {Session | null} session - The session object, which can be null if the user is not authenticated.
 */
export interface GraphQLContext {
  session: Session | null;
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
