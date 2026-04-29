"use client";

import { PieChart as RPie, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Holding } from "@/lib/api";

const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#ec4899", "#84cc16"];

export function SectorPieChart({ holdings }: { holdings: Holding[] }) {
  const bySector = new Map<string, number>();
  for (const h of holdings) {
    const v = h.quantity * h.currentPrice;
    bySector.set(h.sector, (bySector.get(h.sector) || 0) + v);
  }
  const data = Array.from(bySector.entries()).map(([name, value]) => ({ name, value }));

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-sm font-semibold text-gray-700 mb-2">Sector Allocation</h3>
      <ResponsiveContainer width="100%" height={300}>
        <RPie>
          <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
            {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
          </Pie>
          <Tooltip formatter={(v: number) => `$${v.toLocaleString()}`} />
          <Legend />
        </RPie>
      </ResponsiveContainer>
    </div>
  );
}
