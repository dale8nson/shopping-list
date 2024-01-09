import clientPromise from "@/lib/mongodb";
import { ReactNode, Suspense } from "react";
import List from "./list";
import type { WithId, Document } from "mongodb";


export default async function Home() {
  const client = await clientPromise;
  const db = client.db('shopping-list');
  const items = db.collection('items');
  const itemList = items.find();
  const itemArr = await itemList.toArray();

  return (
    <main className="absolute w-[100vw] h-[100vh] lg:w-[50vw] lg:h-[100vh] lg:mx-[25vw] lg:my-0"> 
        <List baseUrl={process.env.BASE_URL as string} />
    </main>
  )
}

// export const dynamic = 'force-dynamic';