"use client";

import { useQuery } from "@apollo/client";
import { GET_MOVEMENTS } from "@/utils/movements";
import { Button } from "@/components/ui/button";

export default function ExportCSVButton() {
  const { data } = useQuery(GET_MOVEMENTS);

  const handleExport = () => {
    if (!data?.movements) return;

    const csvContent = [
      ["Concepto", "Monto", "Fecha"],
      ...data.movements.map((m: any) => [
        m.concept,
        m.amount,
        new Date(m.date).toLocaleDateString(),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "reporte_movimientos.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return <Button onClick={handleExport}>Exportar CSV</Button>;
}
