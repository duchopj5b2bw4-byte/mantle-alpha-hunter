import WalletSearch from "@/components/WalletSearch";
import SampleWallets from "@/components/SampleWallets";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] text-center">
      <div className="mb-2">
        <span className="text-xs text-blue-400 bg-blue-900/30 px-3 py-1 rounded-full border border-blue-800/50">
          Turing Test Hackathon 2026 · Consumer & Viral DApps
        </span>
      </div>

      <h1 className="text-5xl font-bold mb-3 tracking-tight">
        <span className="text-blue-400">Mantle</span>{" "}
        <span className="text-gray-100">Alpha Hunter</span>
      </h1>
      <p className="text-gray-400 mb-2 max-w-lg">
        On-chain intelligence powered by AI. Enter any Mantle wallet
        address to get instant analysis, risk scoring, and actionable insights.
      </p>
      <p className="text-gray-600 text-sm mb-8 max-w-md">
        Detects anomalies · Classifies behavior · Health scoring · Shareable reports
      </p>

      <WalletSearch />

      <div className="mt-4">
        <SampleWallets />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12 w-full max-w-4xl">
        <div className="bg-[#111] border border-gray-800 rounded-xl p-5 text-left hover:border-blue-800/50 transition group">
          <div className="w-10 h-10 rounded-lg bg-blue-900/30 flex items-center justify-center mb-3 group-hover:bg-blue-900/50 transition">
            <span className="text-lg">🤖</span>
          </div>
          <h3 className="font-medium text-sm mb-1">AI Evaluation</h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            Activity scoring, risk assessment, anomaly detection, and wallet health index powered by GPT-5.4
          </p>
        </div>
        <div className="bg-[#111] border border-gray-800 rounded-xl p-5 text-left hover:border-blue-800/50 transition group">
          <div className="w-10 h-10 rounded-lg bg-blue-900/30 flex items-center justify-center mb-3 group-hover:bg-blue-900/50 transition">
            <span className="text-lg">📊</span>
          </div>
          <h3 className="font-medium text-sm mb-1">On-Chain Metrics</h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            Real-time balance, transaction history, counterparty analysis, and activity patterns from Mantle RPC
          </p>
        </div>
        <div className="bg-[#111] border border-gray-800 rounded-xl p-5 text-left hover:border-blue-800/50 transition group">
          <div className="w-10 h-10 rounded-lg bg-blue-900/30 flex items-center justify-center mb-3 group-hover:bg-blue-900/50 transition">
            <span className="text-lg">🎯</span>
          </div>
          <h3 className="font-medium text-sm mb-1">Smart Classification</h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            Auto-tags like whale, trader, DEX user, bridge user, bot — with behavior category and risk flags
          </p>
        </div>
      </div>

      <div className="flex gap-8 mt-12 text-xs text-gray-600">
        <span>AI-powered by gpt-5.4-mini</span>
        <span>·</span>
        <span>Mantle Sepolia Testnet</span>
        <span>·</span>
        <span>Contract: 0x538f...c981</span>
      </div>
    </div>
  );
}
