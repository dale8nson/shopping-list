import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { addItem, deleteItem, toggleCompleted, updateItem } from "@/actions";

export async function POST (req: NextRequest) {
  const action = req.headers.get('action');
  let res;
  const json = await req.json();
  switch(action) {
    case 'add':
      res = await addItem(json.name, json.id);
      break;
    case 'delete':
      res = await deleteItem(json.name, json.id);
      break;
    case 'toggle':
      res = await toggleCompleted(json.name, json.id);
      break;
    case 'update':
      res = await updateItem(json.oldName, json.newName, json.id);
    break; 
    default:
      break;
  }
  
  return new NextResponse(JSON.stringify(res), {status:200, statusText:'All good'} );
}

export const dynamic = 'force-dynamic';
