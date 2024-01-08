import { NextResponse } from "next/server";

export const GET = async () => {
  const uuid = crypto.randomUUID();
 return NextResponse.json({uuid:uuid});
}