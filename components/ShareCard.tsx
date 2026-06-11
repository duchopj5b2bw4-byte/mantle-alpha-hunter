"use client";

interface ShareCardProps {
  address: string;
  summary: string;
  activityScore: number;
  labels: string[];
}

export default function ShareCard({ address, summary, activityScore, labels }: ShareCardProps) {
  const shareText = `🐋 Mantle Alpha Hunter Report\n\nWallet: ${address.slice(0, 8)}...${address.slice(-4)}\n${summary}\nScore: ${activityScore}/100\nLabels: ${labels.join(", ")}\n\nCheck any Mantle wallet: https://mantle-alpha-hunter.vercel.app`;

  const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;

  return (
    <a
      href={shareUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-500 rounded-lg text-sm font-medium transition"
    >
      Share on X
    </a>
  );
}
