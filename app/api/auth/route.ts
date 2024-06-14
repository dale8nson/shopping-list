import type { NextRequest } from "next/server"
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
const bcrypt = require('bcrypt')

export const GET = async (req:NextRequest) => {
  const url = new URL('/error/no-credentials', req.url)
  const user = req.headers.get('User');
  const code = req.headers.get('Code');
  const client = await clientPromise;
  const db = client?.db('shopping-list-demo');
  const passwords = db?.collection('passwords');
  const password = await passwords?.findOne({user});
  if(!password) {
    return NextResponse.redirect(url);
  }
  const valid = await bcrypt.compare(code, password.hash);
  console.log(`/api/auth valid`, valid);
  if(!valid) {
    return NextResponse.json({value:false});
  }

  return NextResponse.json({value: true});
}

export const dynamic = 'force-dynamic';
