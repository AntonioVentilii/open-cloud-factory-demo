// Route table for the gateway. Each handler returns {status, body}.
import { readFileSync } from 'node:fs';
import { isAuthorized } from './auth.js';

const { version } = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));

export const routes = {
  'GET /status': () => ({ status: 200, body: { service: 'open-cloud-gateway', ok: true } }),
  'GET /version': () => ({ status: 200, body: { version } }),
  'GET /engines': (req) => isAuthorized(req)
    ? { status: 200, body: { engines: [] } }
    : { status: 401, body: { error: 'unauthorized' } },
};

export function dispatch(req) {
  const key = `${req.method} ${new URL(req.url, 'http://x').pathname}`;
  const handler = routes[key];
  return handler ? handler(req) : { status: 404, body: { error: 'not found' } };
}
