import { NextRequest, NextResponse } from "next/server";
import { getWalletTransactions, getBalance } from "@/lib/mantle";
import { analyzeWallet } from "@/lib/openai";

export async function GET(req: NextRequest) {
  const address = req.nextUrl.searchParams.get("address");
  if (!address) {
    return NextResponse.json({ error: "Missing address" }, { status: 400 });
  }

  try {
    const [balance, transactions] = await Promise.all([
      getBalance(address),
      getWalletTransactions(address),
    ]);

    const analysis = await analyzeWallet(address, balance, transactions.length, transactions);
    return NextResponse.json({ balance, transactions, analysis });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
