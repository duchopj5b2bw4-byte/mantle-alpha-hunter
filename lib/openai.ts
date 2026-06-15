import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
  baseURL: process.env.OPENAI_BASE_URL || undefined,
});
const MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";

export interface AnalysisResult {
  summary: string;
  riskLevel: "low" | "medium" | "high";
  activityScore: number;
  healthScore: number;
  labels: string[];
  insight: string;
  anomalyFlags: { type: string; severity: "info" | "warning" | "danger"; detail: string }[];
  category: string;
  metrics: {
    totalIn: string;
    totalOut: string;
    txCount: number;
    uniqueCounterparties: number;
    avgValue: string;
    peakActivity: string;
  };
}

export async function analyzeWallet(
  address: string,
  balance: string,
  txCount: number,
  transactions: { hash: string; from: string; to: string | null; value: string; timestamp: number; gasUsed?: string }[],
  totalTxCount = txCount
): Promise<AnalysisResult> {
  const recent = transactions.slice(0, 15);
  const txLines = recent.map((tx) =>
    `${tx.from === address.toLowerCase() ? "SENT" : "RECEIVED"} ${tx.value} MNT ${tx.to ? `${tx.from === address.toLowerCase() ? "to" : "from"} ${tx.to}` : "(contract creation)"}`
  ).join("\n");

  const incoming = recent.filter(tx => tx.to?.toLowerCase() === address.toLowerCase());
  const outgoing = recent.filter(tx => tx.from.toLowerCase() === address.toLowerCase());
  const totalIn = incoming.reduce((s, tx) => s + parseFloat(tx.value || "0"), 0);
  const totalOut = outgoing.reduce((s, tx) => s + parseFloat(tx.value || "0"), 0);
  const counterparties = new Set(recent.map(tx => tx.from.toLowerCase() === address.toLowerCase() ? tx.to?.toLowerCase() : tx.from.toLowerCase()).filter(Boolean));

  const totalAvg = recent.length ? (totalIn + totalOut) / recent.length : 0;
  const hours = recent.map(tx => new Date(tx.timestamp * 1000).getHours());
  const peakHour = hours.length ? [...hours].sort((a, b) => hours.filter(h => h === a).length - hours.filter(h => h === b).length).pop() : 12;
  const hourLabel = peakHour !== undefined ? `${peakHour}:00-${(peakHour + 1) % 24}:00` : "unknown";

  const prompt = `You are Mantle Alpha Hunter, a blockchain analyst AI. Analyze this Mantle wallet and output ONLY valid JSON (no markdown, no code blocks).

Wallet: ${address}
Balance: ${balance} MNT
Total TXs: ${txCount}

Incoming: ${totalIn.toFixed(4)} MNT
Outgoing: ${totalOut.toFixed(4)} MNT
Unique counterparties: ${counterparties.size}
Avg TX value: ${totalAvg.toFixed(4)} MNT
Peak activity hour: ${hourLabel}

Recent activity:
${txLines}

Output JSON with exactly these fields:
{
  "summary": "one-sentence wallet description",
  "riskLevel": "low|medium|high",
  "activityScore": 1-100,
  "healthScore": 1-100,
  "labels": ["tag1","tag2"],
  "insight": "one actionable recommendation",
  "category": "trader|investor|whale|bot|bridge-user|defi-user|new-wallet|inactive|dex-trader|collector",
  "anomalyFlags": [{"type":"flag-name","severity":"info|warning|danger","detail":"description"}],
  "metrics": { "totalIn":"0","totalOut":"0","txCount":0,"uniqueCounterparties":0,"avgValue":"0","peakActivity":"${hourLabel}" }
}`;

  try {
    const response = await client.chat.completions.create({
      model: MODEL,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2,
      max_tokens: 600,
    });

    const text = response.choices[0]?.message?.content || "";
    return parseAnalysis(text, totalIn, totalOut, txCount, counterparties.size, totalAvg, hourLabel, balance, totalTxCount);
  } catch (err) {
    console.error("OpenAI error:", err);
    return fallbackAnalysis(totalIn, totalOut, txCount, counterparties.size, totalAvg, hourLabel, balance, totalTxCount);
  }
}

function parseAnalysis(
  text: string,
  totalIn: number, totalOut: number, txCount: number, uniqueCps: number, avgVal: number, peak: string,
  balance = "0", totalTxCount = txCount
): AnalysisResult {
  try {
    const cleaned = text.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
    const json = JSON.parse(cleaned);
    return {
      summary: json.summary || "AI analysis complete.",
      riskLevel: (json.riskLevel || "medium") as "low" | "medium" | "high",
      activityScore: json.activityScore || 50,
      healthScore: json.healthScore || 50,
      labels: json.labels || ["unclassified"],
      insight: json.insight || "No additional insight available.",
      anomalyFlags: json.anomalyFlags || [],
      category: json.category || "unclassified",
      metrics: {
        totalIn: totalIn.toFixed(4),
        totalOut: totalOut.toFixed(4),
        txCount,
        uniqueCounterparties: uniqueCps,
        avgValue: avgVal.toFixed(4),
        peakActivity: peak,
      },
    };
  } catch {
    return fallbackAnalysis(totalIn, totalOut, txCount, uniqueCps, avgVal, peak, balance, totalTxCount);
  }
}

function fallbackAnalysis(
  totalIn: number, totalOut: number, txCount: number, uniqueCps: number, avgVal: number, peak: string,
  balance = "0", totalTxCount = txCount
): AnalysisResult {
  const bal = Math.min(5, parseFloat(balance));
  const risk = totalOut > 10 ? "high" : totalIn + totalOut > 1 ? "medium" : "low";
  const logTx = Math.log2(totalTxCount + 1);
  const score = Math.min(100, Math.max(1,
    Math.round(logTx * 6 + bal * 3 + txCount * 1 + uniqueCps * 1)
  ));
  const health = Math.min(100, Math.max(1,
    Math.round(logTx * 4 + bal * 4 + (totalOut > 10 ? -20 : totalIn + totalOut > 1 ? -5 : 10))
  ));
  return {
    summary: "Wallet data retrieved. Detailed AI analysis temporarily unavailable.",
    riskLevel: risk,
    activityScore: score,
    healthScore: health,
    labels: totalTxCount > 1000 ? ["active"] : parseFloat(balance) > 0.1 ? ["funded"] : ["inactive"],
    insight: "Connect to Mantle testnet to explore this wallet's transaction history.",
    anomalyFlags: [],
    category: totalTxCount > 10000 ? "trader" : totalTxCount > 500 ? "defi-user" : parseFloat(balance) > 0.1 ? "holder" : "new-wallet",
    metrics: {
      totalIn: totalIn.toFixed(4),
      totalOut: totalOut.toFixed(4),
      txCount,
      uniqueCounterparties: uniqueCps,
      avgValue: avgVal.toFixed(4),
      peakActivity: peak,
    },
  };
}
