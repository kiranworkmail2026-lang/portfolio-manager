"use client";

import { BarChart as RBar, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Holding } from "@/lib/api";

export function TopHoldingsBarChart({ holdings }: { holdings: Holding[] }) {
  const data = [...holdings]
    .map((h) => ({ symbol: h.symbol, value: h.quantity * h.currentPrice }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-sm font-semibold text-gray-700 mb-2">Top 10 Holdings (by current value)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <RBar data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="symbol" />
          <YAxis />
          <Tooltip formatter={(v: number) => `$${v.toLocaleString()}`} />
          <Bar dataKey="value" fill="#6366f1" />
        </RBar>
      </ResponsiveContainer>
    </div>
  );
}
