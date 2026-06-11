import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
  baseURL: process.env.OPENAI_BASE_URL || undefined,
});
const MODEL = process.env.OPENAI_MODEL || "gpt-5.4-mini";

export interface AnalysisResult {
  summary: string;
  riskLevel: "low" | "medium" | "high";
  activityScore: number;
  labels: string[];
  insight: string;
}

export async function analyzeWallet(
  address: string,
  balance: string,
  txCount: number,
  transactions: { hash: string; from: string; to: string | null; value: string; timestamp: number }[]
): Promise<AnalysisResult> {
  const txSummary = transactions.slice(0, 10).map(
    (tx) => `${tx.from === address.toLowerCase() ? "SENT" : "RECEIVED"} ${tx.value} ETH ${tx.to ? `to/from ${shortenAddr(tx.to || tx.from)}` : ""}`
  ).join("\n");

  const prompt = `You are a blockchain analyst. Analyze this Mantle wallet:

Address: ${address}
Balance: ${balance} MNT
Total transactions found: ${txCount}

Recent activity:
${txSummary}

Provide:
1. One-sentence summary of this wallet's behavior
2. Risk level (low/medium/high) — based on activity patterns
3. Activity score (1-100)
4. Labels (comma-separated tags like "whale", "trader", "new wallet", "DEX user", "bridge user", "inactive")
5. One actionable insight

Format your response exactly as:
SUMMARY: <text>
RISK: <level>
SCORE: <number>
LABELS: <tag1, tag2, ...>
INSIGHT: <text>`;

  try {
    const response = await client.chat.completions.create({
      model: MODEL,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
      max_tokens: 300,
    });

    const text = response.choices[0]?.message?.content || "";
    return parseAnalysis(text);
  } catch (err) {
    console.error("OpenAI error:", err);
    return fallbackAnalysis();
  }
}

function parseAnalysis(text: string): AnalysisResult {
  const get = (label: string) => {
    const match = text.match(new RegExp(`${label}:\\s*(.+)`));
    return match ? match[1].trim() : "";
  };

  return {
    summary: get("SUMMARY"),
    riskLevel: (get("RISK").toLowerCase() as "low" | "medium" | "high") || "medium",
    activityScore: parseInt(get("SCORE")) || 50,
    labels: get("LABELS").split(",").map((s) => s.trim()).filter(Boolean),
    insight: get("INSIGHT"),
  };
}

function fallbackAnalysis(): AnalysisResult {
  return {
    summary: "No detailed analysis available. Wallet data is being indexed.",
    riskLevel: "medium",
    activityScore: 50,
    labels: ["unclassified"],
    insight: "Check back after more transactions are indexed.",
  };
}

function shortenAddr(addr: string): string {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}
