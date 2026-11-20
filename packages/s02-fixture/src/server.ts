import { createServer } from 'node:http';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { fixtureLabel } from './index.js';

const page = `<!doctype html>
<html lang="en"><meta charset="utf-8"><title>${fixtureLabel}</title>
<h1>${fixtureLabel}</h1>
<button type="button">Increment</button>
<output role="status">0</output>
<script src="/fixture.js" defer></script></html>`;

const script = `document.querySelector('button').addEventListener('click', () => {
  const output = document.querySelector('output');
  output.textContent = String(Number(output.textContent) + 1);
});`;

export function createFixtureServer() {
  return createServer((request, response) => {
    response.setHeader('X-Content-Type-Options', 'nosniff');
    response.setHeader('Content-Security-Policy', "default-src 'none'; script-src 'self'");
    if (request.method !== 'GET') {
      response.writeHead(405, { Allow: 'GET' }).end('Method not allowed');
      return;
    }
    switch (request.url) {
      case '/':
        response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' }).end(page);
        break;
      case '/fixture.js':
        response.writeHead(200, { 'Content-Type': 'application/javascript' }).end(script);
        break;
      case '/__s02/health':
        response
          .writeHead(200, { 'Content-Type': 'application/json' })
          .end(JSON.stringify({ status: 'ok', testOnly: true }));
        break;
      case '/__s02/mock':
        response
          .writeHead(200, { 'Content-Type': 'application/json' })
          .end(JSON.stringify({ message: 'S02 fixture', testOnly: true }));
        break;
      default:
        response.writeHead(404, { 'Content-Type': 'text/plain' }).end('Not found');
    }
  });
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const server = createFixtureServer();
  server.listen(4173, '127.0.0.1');
  for (const signal of ['SIGINT', 'SIGTERM'] as const) {
    process.once(signal, () => server.close());
  }
}
