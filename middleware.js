import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname } = req.nextUrl;

  // 1️⃣ Not logged in → block all protected routes
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // 2️⃣ Logged in but not admin → block admin routes
  if (pathname.startsWith("/admin") && token.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // 3️⃣ Everything else allowed
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/user/:path*"],
};
