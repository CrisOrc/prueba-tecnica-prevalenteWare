"use client";

import { useSession } from "next-auth/react";
import { useQuery, gql } from "@apollo/client";
import { useEffect } from "react";
import { redirect } from "next/navigation";
import { Movement, User } from "@prisma/client";
import { format, isValid, parseISO } from "date-fns";
import { es } from "date-fns/locale";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Button } from "@/components/ui/button";
import { TrendingUp } from "lucide-react";

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
 * Groups movements by month to prepare data for the chart.
 *
 * @param {Movement[]} movements - The list of movements.
 * @returns {Array} - Data formatted for the bar chart.
 */
function groupMovementsByMonth(movements: Movement[]) {
  const monthsMap = new Map();

  movements.forEach((m) => {
    let date = new Date(m.date);

    // If the date is in timestamp format, convert it to Date
    if (typeof m.date === "number") {
      date = new Date(m.date);
    } else if (typeof m.date === "string") {
      date = parseISO(m.date);
    }

    // Validate that the date is valid
    if (!isValid(date)) {
      console.warn("Invalid date found:", m.date);
      return; // Skip this record if the date is invalid
    }

    const month = format(date, "MMMM", { locale: es });

    if (!monthsMap.has(month)) {
      monthsMap.set(month, { month, ingresos: 0, egresos: 0 });
    }

    const entry = monthsMap.get(month);
    if (m.amount >= 0) {
      entry.ingresos += m.amount;
    } else {
      entry.egresos += Math.abs(m.amount);
    }
  });

  return Array.from(monthsMap.values());
}

/**
 * Handles the download of the report as a CSV file.
 *
 * @param {Movement[]} movements - The list of movements.
 */
function handleDownloadCSV(movements: Movement[]) {
  const header = "ID,Concepto,Monto,Fecha\n";
  const rows = movements
    .map(
      (m) =>
        `${m.id},${m.concept},${m.amount},${parseISO(m.date).toISOString()}`,
    )
    .join("\n");

  const csvContent = header + rows;
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "reporte_movimientos.csv";
  link.click();
}

/**
 * ReportsPage Component
 *
 * Displays financial reports for admin users, including a bar chart and CSV download.
 *
 * @returns {JSX.Element} The rendered Reports Page component.
 */
export default function ReportsPage() {
  const { data: session, status } = useSession();
  const { data, loading, error } = useQuery(GET_MOVEMENTS, {
    skip: !session || (session.user as User)?.role !== "ADMIN",
  });

  useEffect(() => {
    if (status === "loading") return;
    if (!session || !session.user || (session.user as User)?.role !== "ADMIN") {
      redirect("/login");
    }
  }, [session, status]);

  if (status === "loading") return <p>Cargando sesión...</p>;
  if (!session || (session.user as any)?.role !== "ADMIN") return null;
  if (loading) return <p>Cargando datos del reporte...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const movements = data.movements;
  const chartData = groupMovementsByMonth(movements);

  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-6">
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle>Reporte Financiero</CardTitle>
          <CardDescription>
            Visualización de ingresos y egresos por mes
          </CardDescription>
        </CardHeader>

        <CardContent>
          <ChartContainer
            config={{
              ingresos: { label: "Ingresos", color: "hsl(var(--chart-1))" },
              egresos: { label: "Egresos", color: "hsl(var(--chart-2))" },
            }}
          >
            <BarChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <YAxis />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dashed" />}
              />
              <Bar dataKey="ingresos" fill="var(--chart-1)" radius={4} />
              <Bar dataKey="egresos" fill="var(--chart-2)" radius={4} />
            </BarChart>
          </ChartContainer>
        </CardContent>

        <CardFooter className="flex flex-col items-start gap-2 text-sm">
          <div className="flex gap-2 font-medium leading-none">
            El balance actual es:{" "}
            <span className="font-bold text-green-600">
              $
              {movements
                .reduce((acc: number, m: Movement) => acc + m.amount, 0)
                .toFixed(2)}
            </span>
            <TrendingUp className="h-4 w-4" />
          </div>
          <div className="leading-none text-muted-foreground">
            Reporte basado en los últimos movimientos registrados.
          </div>
          <Button onClick={() => handleDownloadCSV(movements)} className="mt-4">
            Descargar Reporte CSV
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
