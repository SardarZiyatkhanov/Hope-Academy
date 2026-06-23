// Edge-compatible session utilities (no Node.js crypto)

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

async function getKey(): Promise<CryptoKey> {
  const enc = new TextEncoder();
  return crypto.subtle.importKey(
    "raw",
    enc.encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

function toHex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function sign(value: string): Promise<string> {
  const key = await getKey();
  const enc = new TextEncoder();
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(value));
  return toHex(sig);
}

export async function createSessionCookie(role: string): Promise<string> {
  const signature = await sign(role);
  const value = `${role}.${signature}`;
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `${COOKIE_NAME}=${value}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${MAX_AGE}${secure}`;
}

export function clearSessionCookie(): string {
  return `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
}

export async function verifySessionCookie(cookieValue: string): Promise<string | null> {
  const dotIndex = cookieValue.lastIndexOf(".");
  if (dotIndex === -1) return null;

  const role = cookieValue.slice(0, dotIndex);
  const providedSig = cookieValue.slice(dotIndex + 1);
  const expectedSig = await sign(role);

  if (providedSig.length !== expectedSig.length) return null;

  let match = true;
  for (let i = 0; i < providedSig.length; i++) {
    if (providedSig[i] !== expectedSig[i]) match = false;
  }

  return match ? role : null;
}

export { COOKIE_NAME };
