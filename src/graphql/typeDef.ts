import { gql } from "graphql-tag";

export const typeDefs = gql`
  enum Role {
    USER
    ADMIN
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
  }

  type Query {
    # Obtener todos los movimientos
    movements: [Movement!]!

    # Obtener todos los usuarios (solo rol=ADMIN)
    users: [User!]!
  }

  type Mutation {
    # Crea un nuevo Movement, asignado al usuario logueado
    createMovement(concept: String!, amount: Float!): Movement!
  }
`;
