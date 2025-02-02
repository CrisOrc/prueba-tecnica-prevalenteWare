import { gql } from "@apollo/client";

/**
 * GraphQL query to fetch all financial movements.
 * Available for all users.
 */
export const GET_MOVEMENTS = gql`
  query GetMovements {
    movements {
      id
      concept
      amount
      date
      type
      user {
        id
        name
      }
    }
  }
`;

/**
 * GraphQL mutation to create a new financial movement.
 * Only accessible by ADMIN role.
 */
export const CREATE_MOVEMENT = gql`
  mutation CreateMovement($input: CreateMovementInput!) {
    createMovement(input: $input) {
      id
      concept
      amount
      date
      userId
    }
  }
`;
