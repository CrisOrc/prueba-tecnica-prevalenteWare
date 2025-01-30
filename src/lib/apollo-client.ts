import { ApolloClient, InMemoryCache } from "@apollo/client";

/**
 * Creating an instance of ApolloClient.
 *
 * This client is configured to interact with the GraphQL endpoint and uses an in-memory cache.
 *
 * @property {string} uri - The URI of the GraphQL endpoint.
 * @property {InMemoryCache} cache - The cache implementation for Apollo Client.
 */
export const apolloClient = new ApolloClient({
  uri: "/api/graphql", // GraphQL endpoint
  cache: new InMemoryCache(),
});
