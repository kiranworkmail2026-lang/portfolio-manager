"use client";

import { Holding } from "@/lib/api";

const fmt = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 });

export function SummaryCards({ holdings }: { holdings: Holding[] }) {
  const invested = holdings.reduce((s, h) => s + h.quantity * h.buyPrice, 0);
  const current = holdings.reduce((s, h) => s + h.quantity * h.currentPrice, 0);
  const pl = current - invested;
  const plPct = invested > 0 ? (pl / invested) * 100 : 0;

  const cards = [
    { label: "Invested", value: fmt(invested), color: "text-gray-900" },
    { label: "Current Value", value: fmt(current), color: "text-gray-900" },
    { label: "P&L", value: fmt(pl), color: pl >= 0 ? "text-green-600" : "text-red-600" },
    { label: "P&L %", value: `${plPct.toFixed(2)}%`, color: plPct >= 0 ? "text-green-600" : "text-red-600" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {cards.map((c) => (
        <div key={c.label} className="bg-white p-4 rounded-lg shadow">
          <div className="text-xs text-gray-500 uppercase">{c.label}</div>
          <div className={`text-2xl font-bold mt-1 ${c.color}`}>{c.value}</div>
        </div>
      ))}
    </div>
  );
}
