import { NextRequest, NextResponse } from "next/server";
import { createSessionCookie } from "@/lib/session";
import { getAdminAuth, getAdminDb } from "@/lib/firebase-admin";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

const VALID_ROLES = new Set(["student", "manager", "superadmin"]);

export async function POST(request: NextRequest) {
  const ip = getClientIp(request.headers);
  const { allowed } = rateLimit(`session:${ip}`, 10, 60_000);
  if (!allowed) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429, headers: { "Retry-After": "60" } },
    );
  }

  try {
    const { idToken } = await request.json();

    if (typeof idToken !== "string" || !idToken) {
      return NextResponse.json({ error: "Missing idToken" }, { status: 400 });
    }

    const decoded = await getAdminAuth().verifyIdToken(idToken);

    const userSnap = await getAdminDb().collection("users").doc(decoded.uid).get();
    if (!userSnap.exists) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const role = userSnap.data()?.role as string;
    if (!VALID_ROLES.has(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 403 });
    }

    const response = NextResponse.json({ ok: true, role });
    response.headers.append("Set-Cookie", createSessionCookie(role));
    return response;
  } catch {
    return NextResponse.json({ error: "Authentication failed" }, { status: 401 });
  }
}
