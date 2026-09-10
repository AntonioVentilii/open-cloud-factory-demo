import http from 'node:http';
import { dispatch } from './routes.js';

const port = Number(process.env.PORT ?? 8080);
http.createServer((req, res) => {
  const { status, body } = dispatch(req);
  res.writeHead(status, { 'content-type': 'application/json' });
  res.end(JSON.stringify(body));
}).listen(port, () => console.log(`open-cloud gateway on :${port}`));
