"use client";

import { Holding } from "@/lib/api";

const fmt = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 });

export function HoldingsTable({ holdings }: { holdings: Holding[] }) {
  return (
    <div className="bg-white rounded-lg shadow overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500">
          <tr>
            <th className="px-4 py-3">Symbol</th>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Qty</th>
            <th className="px-4 py-3">Buy Price</th>
            <th className="px-4 py-3">Current</th>
            <th className="px-4 py-3">P&L</th>
            <th className="px-4 py-3">P&L %</th>
            <th className="px-4 py-3">Sector</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {holdings.map((h, i) => {
            const invested = h.quantity * h.buyPrice;
            const current = h.quantity * h.currentPrice;
            const pl = current - invested;
            const plPct = invested > 0 ? (pl / invested) * 100 : 0;
            const plClass = pl >= 0 ? "text-green-600" : "text-red-600";
            return (
              <tr key={i}>
                <td className="px-4 py-3 font-semibold">{h.symbol}</td>
                <td className="px-4 py-3 text-gray-700">{h.name}</td>
                <td className="px-4 py-3">{h.quantity}</td>
                <td className="px-4 py-3">{fmt(h.buyPrice)}</td>
                <td className="px-4 py-3">{fmt(h.currentPrice)}</td>
                <td className={`px-4 py-3 ${plClass}`}>{fmt(pl)}</td>
                <td className={`px-4 py-3 ${plClass}`}>{plPct.toFixed(2)}%</td>
                <td className="px-4 py-3 text-gray-600">{h.sector}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
