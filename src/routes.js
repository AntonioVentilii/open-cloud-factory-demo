// Route table for the gateway. Each handler returns {status, body}.
import { isAuthorized } from './auth.js';

export const routes = {
  'GET /status': () => ({ status: 200, body: { service: 'open-cloud-gateway', ok: true } }),
  'GET /engines': (req) => isAuthorized(req)
    ? { status: 200, body: { engines: [] } }
    : { status: 401, body: { error: 'unauthorized' } },
};

export function dispatch(req) {
  const key = `${req.method} ${new URL(req.url, 'http://x').pathname}`;
  const handler = routes[key];
  return handler ? handler(req) : { status: 404, body: { error: 'not found' } };
}
