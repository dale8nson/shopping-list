import clientPromise from "@/lib/mongodb";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";


export const GET = async (req: NextRequest) => {
  const client = await clientPromise;
  const db = client.db('shopping-list-demo');
  console.log('db: ', db)
  const items = db.collection('items');
  console.log('items: ', items)
  const itemList = items.find();
  const itemArr = await itemList.toArray();
  const json = itemArr.map(item => ({name:item.name, completed:item.completed, id: item.id}));
  return NextResponse.json(json);
}

export const dynamic = 'force-dynamic';

// export const revalidate = 10;