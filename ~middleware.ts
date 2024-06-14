import { NextRequest } from "next/server"
import { NextResponse } from "next/server";

const middleware = async (req:NextRequest) => {
  console.log(`middleware`);
  const searchParams = req.nextUrl.searchParams;
  const user = searchParams.get('user');
  const code = searchParams.get('code');
  let url = new URL('/error/no-credentials', req.nextUrl)
  console.log(`middleware url:`, url);
  if(!user || !code) {
    return NextResponse.redirect(url);
  }

  const valid = await fetch(new URL('/api/auth', req.url), {headers:{'Content-Type':'application/json', 'User':user, 'Code':code}})
  .then(res => res.json())
  .then(json => json.value);

  console.log(`middleware valid:`, valid);

  if(!valid) {
    return NextResponse.redirect(url);
  }
  
  return fetch(new URL(req.url));
}

export default middleware;

export const config = {
  matcher: '/:path'
}

export const dynamic = 'force-dynamic';