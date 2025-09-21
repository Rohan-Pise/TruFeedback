import {NextResponse} from "next/server";
import {getToken} from "next-auth/jwt";

export async function middleware(req){
  //retrieving the token 
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  
  const{pathname} = req.nextUrl;

  const publicPaths=["/","/login" ];
  if(publicPaths.includes(pathname)){
    return NextResponse.next();
  }

   if (pathname.startsWith("/api/auth") ||
  pathname.startsWith("/api/send-feedback")||
pathname.startsWith("/api/isPaid-status-check")||
  pathname.startsWith("/api/message-suggestions")) {
    return NextResponse.next();
  }

  if ((token && pathname === "/")|| (token && pathname.startsWith("/auth"))) {
      return NextResponse.redirect(new URL("/Dashboard", req.url));
    }

  
  if(pathname.startsWith("/api")|| pathname.startsWith("/dashboard")){
    const token = await getToken({req, secret:process.env.NEXTAUTH_SECRET});

    if(!token){
      return NextResponse.redirect(new URL("/", req.url));
    }

  }

  return NextResponse.next();

}

export const config={
  matcher:[
    "/api/:path*",
    "/Dashboard/:path*",
  ]
}