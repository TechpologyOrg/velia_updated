export function parseJwt(token) {
  try {
    const base64 = token.split('.')[1];
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
}

export function msUntilExpiry(token) {
  const p = parseJwt(token);
  if (!p?.exp) return -1;
  const now = Math.floor(Date.now() / 1000);
  return (p.exp - now) * 1000;
}