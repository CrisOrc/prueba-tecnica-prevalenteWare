"use client";

import { useSession } from "next-auth/react";
import { gql, useQuery, useMutation } from "@apollo/client";
import { useState } from "react";
import { redirect } from "next/navigation";
import { Movement } from "@prisma/client";

/**
 * GraphQL query to fetch all movements.
 */
const GET_MOVEMENTS = gql`
  query Movements {
    movements {
      id
      concept
      amount
      date
      userId
      user {
        name
        email
      }
    }
  }
`;

/**
 * GraphQL mutation to create a new movement.
 */
const CREATE_MOVEMENT = gql`
  mutation CreateMovement($concept: String!, $amount: Float!) {
    createMovement(concept: $concept, amount: $amount) {
      id
      concept
      amount
      date
      userId
    }
  }
`;

/**
 * Transactions Page Component.
 *
 * This component handles the display and creation of financial movements.
 *
 * @returns {JSX.Element} The rendered Transactions Page component.
 */
export default function TransactionsPage() {
  const { data: session, status } = useSession();
  const { data, loading, error, refetch } = useQuery(GET_MOVEMENTS);
  const [createMovement] = useMutation(CREATE_MOVEMENT);
  const [concept, setConcept] = useState("");
  const [amount, setAmount] = useState("");

  console.log("session", session);

  /**
   * Verifies the session status.
   *
   * @returns {JSX.Element | null} The loading or authentication message, or null.
   */
  if (status === "loading") {
    return <p>Loading session...</p>;
  }
  if (!session) {
    return <p>You are not authenticated. Please log in.</p>;
  }

  /**
   * Handler to create a new movement (only if role=ADMIN).
   *
   * @returns {Promise<void>} The result of the create movement operation.
   */
  async function handleCreateMovement() {
    if (!session) {
      redirect("/");
    }

    if (session.user?.role !== "ADMIN") {
      alert("You do not have permission to create a movement");
      return;
    }
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount)) {
      alert("Invalid amount");
      return;
    }
    try {
      await createMovement({
        variables: {
          concept,
          amount: parsedAmount,
        },
      });
      // Clear inputs and refresh the list
      setConcept("");
      setAmount("");
      refetch();
    } catch (err) {
      console.error(err);
      alert("Error creating movement");
    }
  }

  /**
   * Renders the Transactions Page.
   *
   * @returns {JSX.Element} The rendered Transactions Page component.
   */
  if (loading) return <p>Loading movements...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Transactions</h1>
      <table border={1} cellPadding={4}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Concept</th>
            <th>Amount</th>
            <th>Date</th>
            <th>User</th>
          </tr>
        </thead>
        <tbody>
          {data.movements.map((m: Movement) => (
            <tr key={m.id}>
              <td>{m.id}</td>
              <td>{m.concept}</td>
              <td>{m.amount}</td>
              <td>{new Date(m.date).toLocaleString()}</td>
              <td>{m.user ? m.user.name : m.userId}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {session.user?.role === "ADMIN" && (
        <div style={{ marginTop: "1rem" }}>
          <h2>Create New Movement</h2>
          <div>
            <label>Concept: </label>
            <input
              value={concept}
              onChange={(e) => setConcept(e.target.value)}
            />
          </div>
          <div>
            <label>Amount: </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <button onClick={handleCreateMovement}>Save</button>
        </div>
      )}
    </div>
  );
}
