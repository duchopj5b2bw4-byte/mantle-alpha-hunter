"use client";

interface AnalysisDashboardProps {
  analysis: {
    summary: string;
    riskLevel: string;
    activityScore: number;
    healthScore: number;
    labels: string[];
    insight: string;
    anomalyFlags: { type: string; severity: string; detail: string }[];
    category: string;
    metrics: {
      totalIn: string;
      totalOut: string;
      txCount: number;
      uniqueCounterparties: number;
      avgValue: string;
      peakActivity: string;
    };
  };
}

export default function AnalysisDashboard({ analysis }: AnalysisDashboardProps) {
  const a = analysis;
  if (!a.metrics) return null;

  const riskColor =
    a.riskLevel === "low" ? "text-green-400" :
    a.riskLevel === "high" ? "text-red-400" : "text-yellow-400";

  const severityColor = (s: string) =>
    s === "danger" ? "bg-red-900/30 border-red-800/50 text-red-300" :
    s === "warning" ? "bg-yellow-900/30 border-yellow-800/50 text-yellow-300" :
    "bg-blue-900/30 border-blue-800/50 text-blue-300";

  const categoryColor: Record<string, string> = {
    trader: "bg-purple-900/30 text-purple-300 border-purple-800/50",
    investor: "bg-green-900/30 text-green-300 border-green-800/50",
    whale: "bg-amber-900/30 text-amber-300 border-amber-800/50",
    bot: "bg-red-900/30 text-red-300 border-red-800/50",
    "bridge-user": "bg-cyan-900/30 text-cyan-300 border-cyan-800/50",
    "defi-user": "bg-blue-900/30 text-blue-300 border-blue-800/50",
    "new-wallet": "bg-gray-900/30 text-gray-300 border-gray-800/50",
    "dex-trader": "bg-orange-900/30 text-orange-300 border-orange-800/50",
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="bg-[#111] border border-gray-800 rounded-xl p-5">
        <p className="text-xs text-gray-500 mb-3 uppercase tracking-wider">Wallet Health</p>
        <div className="flex items-center gap-4">
          <div className="relative w-20 h-20">
            <svg className="w-20 h-20 -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="15.5" fill="none" stroke="#1f2937" strokeWidth="3" />
              <circle
                cx="18" cy="18" r="15.5" fill="none"
                stroke={a.healthScore > 70 ? "#22c55e" : a.healthScore > 40 ? "#eab308" : "#ef4444"}
                strokeWidth="3"
                strokeDasharray={`${a.healthScore * 0.97} 97`}
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-lg font-bold">
              {a.healthScore}
            </span>
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Activity</span>
              <span className="text-blue-400 font-mono">{a.activityScore}/100</span>
            </div>
            <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${a.activityScore}%` }} />
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Risk</span>
              <span className={`font-mono ${riskColor}`}>{a.riskLevel.toUpperCase()}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#111] border border-gray-800 rounded-xl p-5">
        <p className="text-xs text-gray-500 mb-3 uppercase tracking-wider">Key Metrics</p>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-gray-500 text-xs">Total In</p>
            <p className="text-green-400 font-mono">{parseFloat(a.metrics.totalIn).toFixed(2)} MNT</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs">Total Out</p>
            <p className="text-red-400 font-mono">{parseFloat(a.metrics.totalOut).toFixed(2)} MNT</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs">Transactions</p>
            <p className="text-gray-200 font-mono">{a.metrics.txCount}</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs">Counterparties</p>
            <p className="text-gray-200 font-mono">{a.metrics.uniqueCounterparties}</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs">Avg Value</p>
            <p className="text-gray-200 font-mono">{parseFloat(a.metrics.avgValue).toFixed(4)}</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs">Peak Activity</p>
            <p className="text-gray-200 font-mono">{a.metrics.peakActivity}</p>
          </div>
        </div>
      </div>

      <div className="bg-[#111] border border-gray-800 rounded-xl p-5">
        <p className="text-xs text-gray-500 mb-3 uppercase tracking-wider">Classification</p>
        <div className="space-y-3">
          <div>
            <p className="text-xs text-gray-500 mb-1">Category</p>
            <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium border ${categoryColor[a.category] || "bg-gray-900/30 text-gray-300 border-gray-800/50"}`}>
              {a.category.replace("-", " ").toUpperCase()}
            </span>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-2">Labels</p>
            <div className="flex flex-wrap gap-1.5">
              {a.labels.map((l, i) => (
                <span key={i} className="px-2 py-0.5 bg-blue-900/30 text-blue-300 text-xs rounded-full border border-blue-800/50">
                  #{l}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {a.anomalyFlags.length > 0 && (
        <div className="lg:col-span-3 bg-[#111] border border-gray-800 rounded-xl p-5">
          <p className="text-xs text-gray-500 mb-3 uppercase tracking-wider">Anomaly Detection</p>
          <div className="space-y-2">
            {a.anomalyFlags.map((flag, i) => (
              <div key={i} className={`flex items-start gap-3 p-3 rounded-lg border ${severityColor(flag.severity)}`}>
                <span className="text-lg mt-0.5">
                  {flag.severity === "danger" ? "🔴" : flag.severity === "warning" ? "🟡" : "🔵"}
                </span>
                <div>
                  <p className="text-sm font-medium capitalize">{flag.type.replace(/-/g, " ")}</p>
                  <p className="text-xs opacity-80">{flag.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="lg:col-span-3 bg-blue-900/10 border border-blue-800/30 rounded-xl p-5">
        <p className="text-xs text-blue-400 mb-2 uppercase tracking-wider">AI Insight</p>
        <p className="text-sm text-gray-300 leading-relaxed">{a.insight}</p>
      </div>
    </div>
  );
}
