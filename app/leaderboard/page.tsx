"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface LeaderEntry {
  address: string;
  score: number;
  label: string;
}

const SEED_WALLETS = [
  "0x4490cdd5d201783db2199f950f845ceb78c022ae3e00abcfc8b3d564b58a237b",
  "0x388c818ca8b9251b393131c08a736a67ccb19297",
  "0x3E5e9111F8f0216d1c5f1b2C3a2b2E5f3f5E5f3f",
];

export default function LeaderboardPage() {
  const [leaders, setLeaders] = useState<LeaderEntry[]>([]);
  const [loading, setLoading] = useState(true);

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
              label: json.analysis.labels[0] || "unknown",
            });
          }
        } catch {
          // skip failed
        }
      }
      results.sort((a, b) => b.score - a.score);
      setLeaders(results);
      setLoading(false);
    };
    fetchAll();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Alpha Leaderboard</h1>
      <p className="text-gray-400 text-sm mb-6">
        Top wallets ranked by AI activity score on Mantle testnet.
      </p>

      <div className="bg-[#111] border border-gray-800 rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-4 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-gray-800 rounded" />
            ))}
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800 text-gray-500 text-xs">
                <th className="text-left py-3 px-4">#</th>
                <th className="text-left py-3 px-4">Wallet</th>
                <th className="text-left py-3 px-4">Label</th>
                <th className="text-right py-3 px-4">Score</th>
              </tr>
            </thead>
            <tbody>
              {leaders.map((entry, i) => (
                <tr key={entry.address} className="border-b border-gray-800/50 hover:bg-gray-900/50">
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
                  <td className="py-3 px-4 text-gray-400">{entry.label}</td>
                  <td className="py-3 px-4 text-right font-mono text-blue-400">{entry.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
