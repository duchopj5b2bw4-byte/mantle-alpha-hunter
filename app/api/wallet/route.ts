import { NextRequest, NextResponse } from "next/server";
import { getWalletTransactions, getBalance } from "@/lib/mantle";

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

    return NextResponse.json({ balance, transactions });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
