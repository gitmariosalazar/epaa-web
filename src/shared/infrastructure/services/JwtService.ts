/**
 * JwtService — Pure utility to decode JWT tokens (no external library).
 * Only decodes the payload; does NOT verify signature.
 */

interface JwtPayload {
  exp?: number;
  iat?: number;
  sub?: string;
  [key: string]: unknown;
}

/**
 * Decodes the payload of a JWT token.
 * Returns null if the token is malformed.
 */
function decodeJwtPayload(token: string): JwtPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    // Base64-url decode the payload (second part)
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    return JSON.parse(jsonPayload) as JwtPayload;
  } catch {
    return null;
  }
}

/**
 * Returns the token expiration time in milliseconds (compatible with Date.now()).
 * Returns null if the token is malformed or has no `exp` claim.
 */
export function getTokenExpirationMs(token: string): number | null {
  const payload = decodeJwtPayload(token);
  if (!payload || typeof payload.exp !== 'number') return null;
  return payload.exp * 1000; // convert seconds → ms
}

/**
 * Returns true if the token is already expired (or about to expire within `bufferMs`).
 */
export function isTokenExpired(token: string, bufferMs = 0): boolean {
  const expMs = getTokenExpirationMs(token);
  if (expMs === null) return true; // treat malformed token as expired
  return Date.now() >= expMs - bufferMs;
}
