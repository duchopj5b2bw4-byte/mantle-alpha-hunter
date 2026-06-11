interface WalletCardProps {
  balance: string;
  address: string;
  analysis: {
    summary: string;
    riskLevel: string;
    activityScore: number;
    labels: string[];
    insight: string;
  } | null;
  loading: boolean;
}

export default function WalletCard({ balance, address, analysis, loading }: WalletCardProps) {
  const riskColor =
    analysis?.riskLevel === "low" ? "text-green-400" :
    analysis?.riskLevel === "high" ? "text-red-400" : "text-yellow-400";

  return (
    <div className="bg-[#111] border border-gray-800 rounded-xl p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-xs text-gray-500 mb-1">Wallet</p>
          <p className="font-mono text-sm text-gray-300">{address}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500 mb-1">Balance</p>
          <p className="text-xl font-bold text-blue-400">{parseFloat(balance).toFixed(4)} MNT</p>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3 animate-pulse">
          <div className="h-4 bg-gray-800 rounded w-3/4" />
          <div className="h-4 bg-gray-800 rounded w-1/2" />
          <div className="h-8 bg-gray-800 rounded w-full" />
        </div>
      ) : analysis ? (
        <>
          <div className="flex gap-4 mb-4 text-sm">
            <span className={riskColor}>Risk: {analysis.riskLevel.toUpperCase()}</span>
            <span className="text-blue-400">Score: {analysis.activityScore}/100</span>
          </div>

          <p className="text-gray-300 text-sm mb-3">{analysis.summary}</p>

          <div className="flex flex-wrap gap-2 mb-4">
            {analysis.labels.map((label, i) => (
              <span key={i} className="px-2 py-1 bg-blue-900/30 text-blue-300 text-xs rounded-full border border-blue-800/50">
                {label}
              </span>
            ))}
          </div>

          <div className="bg-blue-900/20 border border-blue-800/30 rounded-lg p-3">
            <p className="text-xs text-blue-400 mb-1">Insight</p>
            <p className="text-sm text-gray-300">{analysis.insight}</p>
          </div>
        </>
      ) : null}
    </div>
  );
}
