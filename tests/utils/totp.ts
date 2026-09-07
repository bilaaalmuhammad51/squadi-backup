import crypto from "crypto";

/**
 * RFC 6238 TOTP generator (base32 secret, SHA-1, 30s step, 6 digits) - the
 * scheme Google Authenticator / Authy use, and what the Squadi/basketball
 * back end validates for two-factor logins.
 *
 * Kept dependency-free (node:crypto only) and app-agnostic: any app whose
 * accounts have a `tfaSecret` in their profile authenticate through the same
 * path, so adding a new TFA-enabled app needs no code change here.
 */
function base32Decode(secret: string): Buffer {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  const clean = secret.replace(/=+$/, "").replace(/\s+/g, "").toUpperCase();
  let bits = 0;
  let value = 0;
  const out: number[] = [];
  for (const char of clean) {
    const idx = alphabet.indexOf(char);
    if (idx === -1) throw new Error(`Invalid base32 character in TFA secret: ${char}`);
    value = (value << 5) | idx;
    bits += 5;
    if (bits >= 8) {
      out.push((value >>> (bits - 8)) & 0xff);
      bits -= 8;
    }
  }
  return Buffer.from(out);
}

export function generateTotp(
  secret: string,
  atMs: number = Date.now(),
  stepSeconds = 30,
  digits = 6,
): string {
  const key = base32Decode(secret);
  const counter = Math.floor(atMs / 1000 / stepSeconds);

  const buf = Buffer.alloc(8);
  buf.writeUInt32BE(Math.floor(counter / 2 ** 32), 0);
  buf.writeUInt32BE(counter % 2 ** 32, 4);

  const hmac = crypto.createHmac("sha1", key).update(buf).digest();
  const offset = hmac[hmac.length - 1] & 0x0f;
  const binary =
    ((hmac[offset] & 0x7f) << 24) |
    (hmac[offset + 1] << 16) |
    (hmac[offset + 2] << 8) |
    hmac[offset + 3];

  return String(binary % 10 ** digits).padStart(digits, "0");
}
