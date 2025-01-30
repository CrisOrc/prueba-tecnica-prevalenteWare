import { resolvers } from "@/graphql/resolvers";
import { GraphQLContext } from "@/graphql/resolvers.types";
import { prisma } from "@/lib/prisma";
import { Movement } from "@prisma/client";

/**
 * Test suite for GraphQL Resolvers.
 */
describe("GraphQL Resolvers", () => {
  /**
   * Test suite for the Query.movements resolver.
   */
  describe("Query.movements", () => {
    /**
     * Test case to ensure an error is thrown if there is no session.
     */
    it("should throw an error if there is no session", async () => {
      const context: GraphQLContext = { session: null };
      await expect(resolvers.Query.movements({}, {}, context)).rejects.toThrow(
        "Not authenticated",
      );
    });

    /**
     * Test case to ensure the list of movements is returned if there is a session.
     */
    it("should return the list of movements if there is a session", async () => {
      // Mock session and prisma
      const mockMovements: Movement[] = [
        {
          id: "1",
          userId: "user1",
          concept: "Salary",
          amount: 1000,
          date: new Date("2023-01-01"),
        },
        {
          id: "2",
          userId: "user2",
          concept: "Freelance",
          amount: 500,
          date: new Date("2023-01-02"),
        },
      ];
      jest
        .spyOn(prisma.movement, "findMany")
        .mockResolvedValueOnce(mockMovements);

      const context: GraphQLContext = {
        session: {
          user: { id: "user1", role: "USER", email: "", name: "" },
          expires: new Date("2023-01-01"),
        },
      };

      const result = await resolvers.Query.movements({}, {}, context);
      expect(result).toEqual(mockMovements);

      jest.restoreAllMocks();
    });
  });
});
