import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { addItem, deleteItem } from "@/actions";

export async function POST (req: NextRequest) {
  const action = req.headers.get('action');
  let res;
  const json = await req.json();
  switch(action) {
    case 'add':
      res = await addItem(json.name);
      break;
    case 'delete':
      res = await deleteItem(json.name);

    default:
      break;
  }
  
  return new NextResponse(JSON.stringify(res), {status:200, statusText:'All good'} );
}