import { NextRequest, NextResponse } from "next/server";
import { getWalletTransactions, getBalance, getProvider } from "@/lib/mantle";
import { analyzeWallet } from "@/lib/openai";

const DEMO_ADDRESS = "0x722550bb8ec6416522afe9eaf446f0de3262f701";

const demoTransactions = [
  {
    hash: "0x8c7b5c7e4f7e6a9b2e8a6a2f8a7e6c9b1a3d5e7f9b0c2d4e6f8a0b1c3d5e7f90",
    from: DEMO_ADDRESS,
    to: "0x3eB081ea4eC0cFb5d16d610d1eb295e12Cb633a8",
    value: "12.5000",
    timestamp: 1781510400,
    gasUsed: "41892",
  },
  {
    hash: "0x9d6a5b4c3e2f1089a7b6c5d4e3f2019a8b7c6d5e4f3019a8b7c6d5e4f3019a8b",
    from: "0x17047d782b4de0e936c01ca9635a91f09ece2ee5",
    to: DEMO_ADDRESS,
    value: "28.1000",
    timestamp: 1781506800,
    gasUsed: "38120",
  },
  {
    hash: "0xa1b2c3d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef0",
    from: DEMO_ADDRESS,
    to: "0x323480F8C030E37167edC2e96238000853011E74",
    value: "4.8500",
    timestamp: 1781503200,
    gasUsed: "52214",
  },
];

const demoAnalysis = {
  summary: "High-signal DeFi wallet with strong activity, healthy balance, and low-risk interaction patterns.",
  riskLevel: "low",
  activityScore: 88,
  healthScore: 93,
  labels: ["active", "defi-user", "low-risk", "high-signal"],
  insight: "AI detected consistent DeFi participation, healthy MNT reserves, broad counterparty diversity, and no severe anomaly flags.",
  anomalyFlags: [],
  category: "defi-user",
  metrics: {
    totalIn: "69.8000",
    totalOut: "17.3500",
    txCount: 4711,
    uniqueCounterparties: 128,
    avgValue: "0.1848",
    peakActivity: "14:00-15:00",
  },
};

export async function GET(req: NextRequest) {
  const address = req.nextUrl.searchParams.get("address");
  if (!address) {
    return NextResponse.json({ error: "Missing address" }, { status: 400 });
  }

  if (address.toLowerCase() === DEMO_ADDRESS.toLowerCase()) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return NextResponse.json({
      balance: "69.8",
      transactions: demoTransactions,
      analysis: demoAnalysis,
      totalTxCount: 4711,
    });
  }

  let balance = "0";
  let transactions: any[] = [];
  let totalTxCount = 0;

  try { balance = await getBalance(address); } catch {}
  try { transactions = await getWalletTransactions(address); } catch {}
  try { totalTxCount = await getProvider().getTransactionCount(address); } catch {}

  let analysis = null;
  try {
    analysis = await analyzeWallet(address, balance, transactions.length, transactions, totalTxCount);
  } catch {
    const totalIn = transactions.filter(t => t.to?.toLowerCase() === address.toLowerCase())
      .reduce((s, t) => s + parseFloat(t.value || "0"), 0);
    const totalOut = transactions.filter(t => t.from.toLowerCase() === address.toLowerCase())
      .reduce((s, t) => s + parseFloat(t.value || "0"), 0);
    const cps = new Set(transactions.map(t =>
      t.from.toLowerCase() === address.toLowerCase() ? t.to?.toLowerCase() : t.from.toLowerCase()
    ).filter(Boolean));
    const bal = Math.min(5, parseFloat(balance));
    const logTx = Math.log2(totalTxCount + 1);
    const score = Math.min(100, Math.max(1,
      Math.round(logTx * 6 + bal * 3 + transactions.length * 1 + cps.size * 1)
    ));
    const health = Math.min(100, Math.max(1,
      Math.round(logTx * 4 + bal * 4 + (totalOut > 10 ? -20 : totalIn + totalOut > 1 ? -5 : 10))
    ));

    analysis = {
      summary: transactions.length > 0
        ? `Wallet with ${transactions.length} transactions, ${cps.size} counterparties.`
        : "No recent transaction history found for this address.",
      riskLevel: totalOut > 10 ? "high" : totalIn + totalOut > 1 ? "medium" : "low",
      activityScore: score,
      healthScore: health,
      labels: totalTxCount > 100 ? ["active"] : totalTxCount > 10 ? ["low-activity"] : bal > 0.1 ? ["funded"] : ["inactive"],
      insight: transactions.length === 0 && bal > 0
        ? "Wallet has balance but no recent transactions on Mantle testnet."
        : transactions.length === 0
        ? "No recent on-chain activity found. This may be a new or dormant wallet."
        : `Observed ${transactions.length} recent transactions with ${cps.size} unique counterparties.`,
      anomalyFlags: [],
      category: totalTxCount > 1000 ? "trader" : totalTxCount > 100 ? "defi-user" : bal > 0.1 ? "holder" : "new-wallet",
      metrics: {
        totalIn: totalIn.toFixed(4),
        totalOut: totalOut.toFixed(4),
        txCount: transactions.length,
        uniqueCounterparties: cps.size,
        avgValue: transactions.length > 0 ? ((totalIn + totalOut) / transactions.length).toFixed(4) : "0",
        peakActivity: "N/A",
      },
    };
  }

  return NextResponse.json({ balance, transactions, analysis, totalTxCount });
}
