"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function WalletSearch() {
  const [address, setAddress] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (address.trim()) {
      router.push(`/analyze/${address.trim()}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl">
      <div className="flex gap-2">
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter Mantle wallet address..."
          className="flex-1 px-4 py-3 bg-[#111] border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:border-blue-500 font-mono text-sm"
        />
        <button
          type="submit"
          className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-medium transition"
        >
          Analyze
        </button>
      </div>
    </form>
  );
}
