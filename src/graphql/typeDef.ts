import { gql } from "graphql-tag";

export const typeDefs = gql`
  enum Role {
    USER
    ADMIN
  }

  enum MovementType {
    INCOME
    EXPENSE
  }

  type User {
    id: String!
    email: String
    name: String
    role: Role!
    movements: [Movement!]!
  }

  type Movement {
    id: String!
    concept: String!
    amount: Float!
    date: String!
    userId: String!
    user: User!
    type: MovementType!
  }

  type Query {
    movements: [Movement!]!

    users: [User!]!
    user(id: String!): User!
  }

  input UpdateUserInput {
    name: String
    role: Role
  }

  input CreateMovementInput {
    concept: String!
    amount: Float!
    userId: String!
    date: String!
    type: MovementType!
  }

  type Mutation {
    createMovement(input: CreateMovementInput!): Movement!

    updateUser(id: String!, input: UpdateUserInput!): User!
  }
`;
