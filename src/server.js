import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { dispatch } from './routes.js';

const port = Number(process.env.PORT ?? 8080);
const publicDir = new URL('../public/', import.meta.url);
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript', '.svg': 'image/svg+xml' };

// The console UI lives in public/. Static files win over the API for GET.
async function serveStatic(req, res) {
  if (req.method !== 'GET') return false;
  const path = new URL(req.url, 'http://x').pathname;
  const file = path === '/' ? 'index.html' : path.slice(1);
  if (file.includes('..')) return false;
  const ext = file.slice(file.lastIndexOf('.'));
  if (!types[ext]) return false;
  try {
    const data = await readFile(new URL(file, publicDir));
    res.writeHead(200, { 'content-type': types[ext] });
    res.end(data);
    return true;
  } catch {
    return false;
  }
}

http.createServer(async (req, res) => {
  if (await serveStatic(req, res)) return;
  const { status, body } = dispatch(req);
  res.writeHead(status, { 'content-type': 'application/json' });
  res.end(JSON.stringify(body));
}).listen(port, () => console.log(`open-cloud gateway on :${port}`));
