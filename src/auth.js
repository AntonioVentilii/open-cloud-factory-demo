// API-key check for the gateway. Keys are read from OPEN_CLOUD_API_KEYS
// (comma-separated). Anything touching this file is gated for human review.
export function parseKeys(env = process.env) {
  return new Set((env.OPEN_CLOUD_API_KEYS ?? '').split(',').map(k => k.trim()).filter(Boolean));
}

export function isAuthorized(req, keys = parseKeys()) {
  const header = req.headers['x-api-key'];
  return typeof header === 'string' && keys.has(header);
}
