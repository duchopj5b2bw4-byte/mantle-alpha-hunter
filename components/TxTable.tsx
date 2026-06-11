interface TxInfo {
  hash: string;
  from: string;
  to: string | null;
  value: string;
  timestamp: number;
  gasUsed: string;
}

export default function TxTable({ transactions, address }: { transactions: TxInfo[]; address: string }) {
  if (transactions.length === 0) {
    return <p className="text-gray-500 text-sm py-4 text-center">No transactions found</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-gray-500 text-xs border-b border-gray-800">
            <th className="text-left py-2 pr-4">Type</th>
            <th className="text-left py-2 pr-4">Value</th>
            <th className="text-left py-2 pr-4">From</th>
            <th className="text-left py-2 pr-4">To</th>
            <th className="text-left py-2 pr-4">Time</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => {
            const isOut = tx.from.toLowerCase() === address.toLowerCase();
            return (
              <tr key={tx.hash} className="border-b border-gray-800/50 hover:bg-gray-900/50 transition">
                <td className={`py-3 pr-4 font-mono text-xs ${isOut ? "text-red-400" : "text-green-400"}`}>
                  {isOut ? "OUT" : "IN"}
                </td>
                <td className="py-3 pr-4 font-mono text-xs">{tx.value} MNT</td>
                <td className="py-3 pr-4 font-mono text-xs text-gray-400">{tx.from.slice(0, 8)}...</td>
                <td className="py-3 pr-4 font-mono text-xs text-gray-400">{tx.to ? tx.to.slice(0, 8) + "..." : "—"}</td>
                <td className="py-3 pr-4 text-xs text-gray-500">
                  {new Date(tx.timestamp * 1000).toLocaleString()}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
