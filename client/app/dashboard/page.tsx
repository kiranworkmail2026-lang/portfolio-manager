"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PrivateRoute } from "@/components/PrivateRoute";
import { SummaryCards } from "@/components/SummaryCards";
import { SectorPieChart } from "@/components/PieChart";
import { TopHoldingsBarChart } from "@/components/BarChart";
import { HoldingsTable } from "@/components/HoldingsTable";
import { api, Portfolio } from "@/lib/api";

export default function DashboardPage() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/api/portfolio")
      .then((r) => setPortfolios(r.data.data))
      .catch((e) => setError(e?.response?.data?.message || "Failed to load"))
      .finally(() => setLoading(false));
  }, []);

  const allHoldings = portfolios.flatMap((p) => p.holdings || []);

  return (
    <PrivateRoute>
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <Link href="/upload" className="bg-indigo-600 text-white px-4 py-2 rounded text-sm hover:bg-indigo-700">
            Upload Portfolio
          </Link>
        </div>

        {loading && <p className="text-gray-500">Loading…</p>}
        {error && <p className="text-red-600">{error}</p>}

        {!loading && allHoldings.length === 0 && (
          <div className="bg-white p-8 rounded-lg shadow text-center text-gray-600">
            No portfolios yet. <Link href="/upload" className="text-indigo-600">Upload one</Link> to get started.
          </div>
        )}

        {allHoldings.length > 0 && (
          <>
            <SummaryCards holdings={allHoldings} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SectorPieChart holdings={allHoldings} />
              <TopHoldingsBarChart holdings={allHoldings} />
            </div>
            <HoldingsTable holdings={allHoldings} />
          </>
        )}
      </div>
    </PrivateRoute>
  );
}
