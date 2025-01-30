/**
 * @jest-environment node
 */

import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "../../src/lib/prisma";

/**
 * Test suite for Auth.js using Prisma Adapter
 */
describe("Auth.js - Prisma Adapter", () => {
  /**
   * Test case to create a user in the database via the adapter
   */
  it("should create a user in the DB via adapter", async () => {
    // Initialize the Prisma adapter with the prisma client
    const adapter = PrismaAdapter(prisma);

    // Create a user using the adapter
    const createUser = await adapter.createUser({
      email: "auth-test@example.com",
      name: "Auth Test",
    });

    // Assertions to verify the user was created correctly
    expect(createUser.id).toBeDefined();
    expect(createUser.email).toBe("auth-test@example.com");
    expect(createUser.role).toBe("USER"); // Default role

    // Cleanup: delete the user created during the test
    await prisma.user.delete({ where: { email: "auth-test@example.com" } });
  });
});
