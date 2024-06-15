import { NextRequest } from "next/server"
import { NextResponse } from "next/server";

const middleware = async (req:NextRequest) => {
  console.log(`middleware`);
  const searchParams = req.nextUrl.searchParams;
  const user = searchParams.get('user');
  const code = searchParams.get('code');
  const { protocol, host} = req.nextUrl
  let url =  `${protocol}//${host}/error/no-credentials`
  console.log(`middleware url:`, url);
  if(!user || !code) {
    return NextResponse.redirect(url);
  }

  const valid = await fetch(`${protocol}//${host}/api/auth`, {headers:{'Content-Type':'application/json', 'User':user, 'Code':code}})
  .then(res => {
    console.log('middleware res: ', res)
    return res.json()
  })
  .then(json => json.value);

  console.log(`middleware valid:`, valid);

  if(!valid) {
    return NextResponse.redirect(url);
  }
  
  return fetch(req.url);
}

export default middleware;

export const config = {
  matcher: '/:path'
}

export const runtime = 'nodejs' 

export const dynamic = 'force-dynamic';