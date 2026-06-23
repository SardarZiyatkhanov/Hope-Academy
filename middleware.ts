import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySessionCookie, COOKIE_NAME } from "@/lib/session";

export function middleware(request: NextRequest) {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  const role = token ? verifySessionCookie(token) : null;
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

  const response = NextResponse.next();

  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()",
  );

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
