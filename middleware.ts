import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const role = request.cookies.get("session_role")?.value;
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/student") && role !== "student") {
    return NextResponse.redirect(new URL("/login?role=student", request.url));
  }

  if (
    pathname.startsWith("/admin") &&
    role !== "manager" &&
    role !== "superadmin"
  ) {
    return NextResponse.redirect(new URL("/login?role=admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/student/:path*", "/admin/:path*"],
};
