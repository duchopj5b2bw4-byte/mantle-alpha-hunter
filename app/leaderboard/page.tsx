"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface LeaderEntry {
  address: string;
  score: number;
  health: number;
  risk: string;
  label: string;
  category: string;
}

const SEED_WALLETS = [
  "0x88d2037c99572cB86a87e7636485aA42c9a47F42",
  "0x4490cdd5d201783db2199f950f845ceb78c022ae",
  "0x388c818ca8b9251b393131c08a736a67ccb19297",
  "0x742d35cc6634c0532925a3b844bc454e4438f44e",
  "0x1cb83ac57a3c6d5a2c4e3a7a8b9c0d1e2f3a4b5c",
];

export default function LeaderboardPage() {
  const [leaders, setLeaders] = useState<LeaderEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<"score" | "health">("score");

  useEffect(() => {
    const fetchAll = async () => {
      const results: LeaderEntry[] = [];
      for (const addr of SEED_WALLETS) {
        try {
          const res = await fetch(`/api/analyze?address=${addr}`);
          const json = await res.json();
          if (json.analysis) {
            results.push({
              address: addr,
              score: json.analysis.activityScore,
              health: json.analysis.healthScore || json.analysis.activityScore,
              risk: json.analysis.riskLevel,
              label: (json.analysis.labels || ["unknown"])[0],
              category: json.analysis.category || "unknown",
            });
          }
        } catch {}
      }
      results.sort((a, b) => b.score - a.score);
      setLeaders(results);
      setLoading(false);
    };
    fetchAll();
  }, []);

  const sorted = [...leaders].sort((a, b) =>
    sortBy === "health" ? b.health - a.health : b.score - a.score
  );

  const riskDot = (r: string) =>
    r === "low" ? "bg-green-400" : r === "high" ? "bg-red-400" : "bg-yellow-400";

  const catBadge = (c: string) => {
    const colors: Record<string, string> = {
      trader: "bg-purple-900/30 text-purple-300",
      whale: "bg-amber-900/30 text-amber-300",
      bot: "bg-red-900/30 text-red-300",
      "defi-user": "bg-blue-900/30 text-blue-300",
      "dex-trader": "bg-orange-900/30 text-orange-300",
    };
    return colors[c] || "bg-gray-900/30 text-gray-300";
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Alpha Leaderboard</h1>
          <p className="text-gray-400 text-sm mt-1">
            Top wallets ranked by AI analysis on Mantle testnet
          </p>
        </div>
        <div className="flex gap-2 text-sm">
          <button
            onClick={() => setSortBy("score")}
            className={`px-3 py-1.5 rounded-lg transition ${sortBy === "score" ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-400 hover:text-white"}`}
          >
            Activity
          </button>
          <button
            onClick={() => setSortBy("health")}
            className={`px-3 py-1.5 rounded-lg transition ${sortBy === "health" ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-400 hover:text-white"}`}
          >
            Health
          </button>
        </div>
      </div>

      <div className="bg-[#111] border border-gray-800 rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-4 animate-pulse">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-14 bg-gray-800 rounded" />
            ))}
          </div>
        ) : sorted.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg mb-1">No data yet</p>
            <p className="text-sm">Search a wallet to start building the leaderboard</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800 text-gray-500 text-xs uppercase">
                <th className="text-left py-3 px-4 w-12">#</th>
                <th className="text-left py-3 px-4">Wallet</th>
                <th className="text-left py-3 px-4">Type</th>
                <th className="text-left py-3 px-4">Label</th>
                <th className="text-right py-3 px-4">Score</th>
                <th className="text-right py-3 px-4">Health</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((entry, i) => (
                <tr key={entry.address} className="border-b border-gray-800/50 hover:bg-gray-900/50 transition">
                  <td className="py-3 px-4">
                    {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}
                  </td>
                  <td className="py-3 px-4">
                    <Link
                      href={`/analyze/${entry.address}`}
                      className="font-mono text-blue-400 hover:text-blue-300 text-xs"
                    >
                      {entry.address.slice(0, 8)}...{entry.address.slice(-4)}
                    </Link>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-xs ${catBadge(entry.category)}`}>
                      {entry.category.replace("-", " ")}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full ${riskDot(entry.risk)}`} />
                      <span className="text-gray-400">{entry.label}</span>
                    </div>
                  </td>
                  <td className={`py-3 px-4 text-right font-mono ${entry.score > 70 ? "text-blue-400" : entry.score > 40 ? "text-yellow-400" : "text-gray-500"}`}>
                    {entry.score}
                  </td>
                  <td className={`py-3 px-4 text-right font-mono ${entry.health > 70 ? "text-green-400" : entry.health > 40 ? "text-yellow-400" : "text-red-400"}`}>
                    {entry.health}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
