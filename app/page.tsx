import WalletSearch from "@/components/WalletSearch";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
      <h1 className="text-4xl font-bold mb-3">
        <span className="text-blue-400">Mantle</span>{" "}
        <span className="text-gray-100">Alpha Hunter</span>
      </h1>
      <p className="text-gray-400 mb-8 max-w-md">
        On-chain intelligence powered by AI. Enter any Mantle wallet
        address to get instant analysis and insights.
      </p>
      <WalletSearch />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-16 w-full max-w-3xl">
        <div className="bg-[#111] border border-gray-800 rounded-xl p-4 text-left">
          <p className="text-2xl mb-1">🔍</p>
          <h3 className="font-medium text-sm mb-1">Wallet Analysis</h3>
          <p className="text-xs text-gray-500">AI-powered behavior scoring and risk assessment</p>
        </div>
        <div className="bg-[#111] border border-gray-800 rounded-xl p-4 text-left">
          <p className="text-2xl mb-1">📊</p>
          <h3 className="font-medium text-sm mb-1">Transaction History</h3>
          <p className="text-xs text-gray-500">Real-time on-chain activity and patterns</p>
        </div>
        <div className="bg-[#111] border border-gray-800 rounded-xl p-4 text-left">
          <p className="text-2xl mb-1">🎯</p>
          <h3 className="font-medium text-sm mb-1">Smart Labels</h3>
          <p className="text-xs text-gray-500">Auto-tags like whale, trader, DEX user, bridge user</p>
        </div>
      </div>

      <p className="text-xs text-gray-600 mt-12">
        Mantle Testnet · AI Alpha & Data · Turing Test Hackathon 2026
      </p>
    </div>
  );
}
