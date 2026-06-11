"use client";

import { use, useEffect, useState } from "react";
import WalletCard from "@/components/WalletCard";
import TxTable from "@/components/TxTable";
import ShareCard from "@/components/ShareCard";
import { isValidAddress } from "@/lib/utils";

export default function AnalyzePage({ params }: { params: Promise<{ address: string }> }) {
  const { address } = use(params);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isValidAddress(address)) {
      setError("Invalid Mantle wallet address");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const res = await fetch(`/api/analyze?address=${address}`);
        if (!res.ok) throw new Error("Failed to fetch data");
        const json = await res.json();
        setData(json);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [address]);

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-400 mb-2">{error}</p>
        <p className="text-gray-500 text-sm">Please enter a valid 0x-prefixed Mantle address</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <WalletCard
        balance={data?.balance || "0"}
        address={address}
        analysis={data?.analysis || null}
        loading={loading}
      />

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">Recent Transactions</h2>
        {data?.analysis && (
          <ShareCard
            address={address}
            summary={data.analysis.summary}
            activityScore={data.analysis.activityScore}
            labels={data.analysis.labels}
          />
        )}
      </div>

      <div className="bg-[#111] border border-gray-800 rounded-xl p-4">
        <TxTable transactions={data?.transactions || []} address={address} />
      </div>
    </div>
  );
}
