import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dispatch } from '../src/routes.js';

const req = (method, url, headers = {}) => ({ method, url, headers });

test('GET /status is public', () => {
  const r = dispatch(req('GET', '/status'));
  assert.equal(r.status, 200);
  assert.equal(r.body.ok, true);
});

test('GET /version returns the package version', () => {
  const { version } = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
  const r = dispatch(req('GET', '/version'));
  assert.equal(r.status, 200);
  assert.equal(r.body.version, version);
});

test('GET /engines needs a key', () => {
  assert.equal(dispatch(req('GET', '/engines')).status, 401);
});

test('unknown route is 404', () => {
  assert.equal(dispatch(req('GET', '/nope')).status, 404);
});
