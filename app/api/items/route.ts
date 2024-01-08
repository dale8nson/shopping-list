import clientPromise from "@/lib/mongodb";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";


export const GET = async (req: NextRequest) => {
  const client = await clientPromise;
  const db = client.db('shopping-list');
  const items = db.collection('items');
  const itemList = items.find();
  console.log(`itemList:`, itemList);
  const itemArr = await itemList.toArray();
  console.log(`itemArr:`, itemArr);
  const json = itemArr.map(item => ({name:item.name, completed:item.completed}))
  return NextResponse.json(json);
}

// export const dynamic = 'force-dynamic';

// export const revalidate = 10;