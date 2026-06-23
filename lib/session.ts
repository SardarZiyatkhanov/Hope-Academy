import { createHmac, timingSafeEqual } from "crypto";

const COOKIE_NAME = "session_token";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function getSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (secret) return secret;
  if (process.env.NODE_ENV === "production") {
    throw new Error("SESSION_SECRET env var is required in production");
  }
  return "dev-only-unsafe-secret-change-me";
}

function sign(value: string): string {
  return createHmac("sha256", getSecret()).update(value).digest("hex");
}

export function createSessionCookie(role: string): string {
  const signature = sign(role);
  const value = `${role}.${signature}`;
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `${COOKIE_NAME}=${value}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${MAX_AGE}${secure}`;
}

export function clearSessionCookie(): string {
  return `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
}

export function verifySessionCookie(cookieValue: string): string | null {
  const dotIndex = cookieValue.lastIndexOf(".");
  if (dotIndex === -1) return null;

  const role = cookieValue.slice(0, dotIndex);
  const providedSig = cookieValue.slice(dotIndex + 1);
  const expectedSig = sign(role);

  if (providedSig.length !== expectedSig.length) return null;

  const valid = timingSafeEqual(
    Buffer.from(providedSig),
    Buffer.from(expectedSig),
  );

  return valid ? role : null;
}

export { COOKIE_NAME };
