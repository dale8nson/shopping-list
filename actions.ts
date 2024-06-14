'use server';

import clientPromise from "@/lib/mongodb";
import { NextRequest } from "next/server";

export const addItem = async (item: string, id?:string) => {
  console.log(`addItem(${item})`);
  const client = await clientPromise;
  const db = client.db('shopping-list-demo');
  const items = db.collection('items');

  const result = items.insertOne({name:item, id, completed: false});
  // console.log(`addItem result:`, result);

  return result;
}

export const deleteItem = async (name:string, id?:string) => {
  const client = await clientPromise;
  const db = client.db('shopping-list-demo');
  const items = db.collection('items');

  const result = await items.deleteOne({name, id});

  return result;
}

export const toggleCompleted = async (name:string, id?:string) => {
  const client = await clientPromise;
  const db = client.db('shopping-list-demo');
  const items = db.collection('items');

  const rec = await items.findOne({name, id});
  const completed = rec?.completed;

  const result = await items.updateOne({name, id}, {$set:{completed:!completed}});

  return result;
}

export const updateItem = async (oldName:string, newName:string, id?:string) => {
  const client = await clientPromise;
  const db = client.db('shopping-list-demo');
  const items = db.collection('items');

  const result = await items.updateOne({name:oldName, id}, {$set:{name:newName}});

  console.log(`updateItem result`);

  return result;

}

export const getUUID = () => crypto.randomUUID();