"use client";

import { useSession } from "next-auth/react";
import { useQuery, gql } from "@apollo/client";
import { useEffect } from "react";
import { redirect } from "next/navigation";
import { Movement } from "@prisma/client";

/**
 * GraphQL query to fetch movements for the report.
 */
const GET_MOVEMENTS = gql`
  query MovementsForReport {
    movements {
      id
      concept
      amount
      date
    }
  }
`;

/**
 * Component for the Reports Page.
 *
 * This component fetches and displays financial reports for admin users.
 * It includes a placeholder chart and a button to download the report as a CSV file.
 *
 * @returns {JSX.Element} The rendered Reports Page component.
 */
export default function ReportsPage() {
  const { data: session, status } = useSession();

  const { data, loading, error } = useQuery(GET_MOVEMENTS, {
    skip: !session || session.user?.role !== "ADMIN",
  });

  useEffect(() => {
    if (status === "loading") return;

    if (!session || !session.user) {
      redirect("/");
    }

    if (session.user?.role !== "ADMIN") {
      redirect("/");
    }
  }, [session, status]);

  if (status === "loading") return <p>Loading session...</p>;
  if (!session || session.user?.role !== "ADMIN") return null;
  if (loading) return <p>Loading data for the report...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const movements = data.movements;

  /**
   * Renders a placeholder chart.
   *
   * @returns {JSX.Element} The rendered placeholder chart.
   */
  function renderFakeChart() {
    return (
      <div style={{ width: "300px", height: "200px", background: "#ccc" }}>
        <p>Placeholder Chart</p>
      </div>
    );
  }

  /**
   * Handles the download of the report as a CSV file.
   */
  function handleDownloadCSV() {
    const header = "id,concept,amount,date\n";
    const rows = movements
      .map((m: Movement) => `${m.id},${m.concept},${m.amount},${m.date}`)
      .join("\n");
    const csvContent = header + rows;

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "report.csv";
    link.click();
  }

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Financial Reports</h1>
      <div style={{ margin: "1rem 0" }}>{renderFakeChart()}</div>
      <p>
        Current Balance (example):{" "}
        {movements.reduce((acc: number, m: Movement) => acc + m.amount, 0)}
      </p>
      <button onClick={handleDownloadCSV}>Download CSV Report</button>
    </div>
  );
}
