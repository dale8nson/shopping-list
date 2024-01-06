'use server';

import clientPromise from "@/lib/mongodb";
import { NextRequest } from "next/server";

export const addItem = async (item: string) => {
  console.log(`addItem(${item})`);
  const client = await clientPromise;
  const db = client.db('shopping-list');
  const items = db.collection('items');

  const result = items.insertOne({name:item, completed: false});
  // console.log(`addItem result:`, result);

  return result;
}

export const deleteItem = async (name:string) => {
  const client = await clientPromise;
  const db = client.db('shopping-list');
  const items = db.collection('items');

  const result = await items.deleteOne({name});

  return result;
}