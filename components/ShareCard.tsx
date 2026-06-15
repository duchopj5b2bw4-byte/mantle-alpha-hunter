"use client";

interface ShareCardProps {
  address: string;
  summary: string;
  activityScore: number;
  healthScore: number;
  riskLevel: string;
  category: string;
  labels: string[];
  metrics: {
    totalIn: string;
    totalOut: string;
    txCount: number;
    uniqueCounterparties: number;
    avgValue: string;
  };
  balance: string;
}

const CONTRACT = "0xc86B5629c8DCcECaaeeB0034D34e6845F60e3673";
const APP_URL = "https://mantle-alpha-hunter.vercel.app";

export default function ShareCard({ address, summary, activityScore, healthScore, riskLevel, category, labels, metrics, balance }: ShareCardProps) {
  const shortBal = parseFloat(balance).toFixed(2);
  const shareText =
    `🐋 Mantle Alpha Hunter\n\n` +
    `${address.slice(0, 8)}...${address.slice(-4)}\n` +
    `Score: ${activityScore}/100 · Health: ${healthScore}/100\n` +
    `Risk: ${riskLevel.toUpperCase()} · ${category}\n` +
    `TXs: ${metrics.txCount} · ${shortBal} MNT\n\n` +
    `📺 youtu.be/Osumiou6xmw\n` +
    `🔍 ${APP_URL}\n` +
    `#MantleAIHackathon`;

  const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;

  return (
    <a
      href={shareUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-500 rounded-lg text-sm font-medium transition"
    >
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
      Share on X
    </a>
  );
}
