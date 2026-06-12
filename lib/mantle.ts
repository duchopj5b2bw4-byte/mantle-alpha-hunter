import { ethers } from "ethers";

const RPC = process.env.MANTLE_RPC || "https://rpc.sepolia.mantle.xyz";

export function getProvider() {
  return new ethers.JsonRpcProvider(RPC);
}

export interface TxInfo {
  hash: string;
  from: string;
  to: string | null;
  value: string;
  timestamp: number;
  gasUsed: string;
}

export async function getWalletTransactions(address: string, limit = 20): Promise<TxInfo[]> {
  const provider = getProvider();
  const history: TxInfo[] = [];
  const addr = address.toLowerCase();
  let blockNumber = await provider.getBlockNumber();

  for (let i = 0; i < 100 && history.length < limit; i++) {
    try {
      const block = await provider.getBlock(blockNumber - i);
      if (!block) continue;

      const txs = block.transactions;
      for (const txHash of txs) {
        try {
          const tx = await provider.getTransaction(txHash);
          if (!tx) continue;
          if (tx.from.toLowerCase() !== addr && (!tx.to || tx.to.toLowerCase() !== addr)) continue;

          const receipt = await provider.getTransactionReceipt(txHash);
          history.push({
            hash: tx.hash,
            from: tx.from,
            to: tx.to,
            value: ethers.formatEther(tx.value),
            timestamp: block.timestamp,
            gasUsed: receipt?.gasUsed.toString() || "0",
          });
          if (history.length >= limit) break;
        } catch {
          continue;
        }
      }
    } catch {
      continue;
    }
  }
  return history;
}

export async function getBalance(address: string): Promise<string> {
  const provider = getProvider();
  const balance = await provider.getBalance(address);
  return ethers.formatEther(balance);
}

export async function getEthPrice(): Promise<number> {
  try {
    const res = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
    );
    const data = await res.json();
    return data.ethereum?.usd || 0;
  } catch {
    return 0;
  }
}

export function shortenAddress(addr: string): string {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export function formatTime(ts: number): string {
  const d = new Date(ts * 1000);
  return d.toLocaleString();
}
