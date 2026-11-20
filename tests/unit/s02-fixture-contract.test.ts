import type { AddressInfo } from 'node:net';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createFixtureServer } from '../../packages/s02-fixture/src/server.js';

let server: ReturnType<typeof createFixtureServer>;
let baseUrl: string;

beforeAll(async () => {
  server = createFixtureServer();
  await new Promise<void>((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolve);
  });
  const address = server.address() as AddressInfo;
  baseUrl = `http://127.0.0.1:${address.port}`;
});

afterAll(async () => {
  await new Promise<void>((resolve, reject) =>
    server.close((error) => (error ? reject(error) : resolve())),
  );
});

describe('S02 fixture HTTP contract', () => {
  it('returns an explicitly test-only health response', async () => {
    const response = await fetch(`${baseUrl}/__s02/health`);
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ status: 'ok', testOnly: true });
  });

  it('returns explicitly test-only mock data', async () => {
    const response = await fetch(`${baseUrl}/__s02/mock`);
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ message: 'S02 fixture', testOnly: true });
  });

  it('uses safe plain responses for unknown and malformed paths', async () => {
    for (const path of ['/__s02/unknown', '/%E0%A4%A']) {
      const response = await fetch(`${baseUrl}${path}`);
      expect(response.status).toBe(404);
      await expect(response.text()).resolves.toBe('Not found');
    }
  });

  it('rejects unsupported methods without an error payload', async () => {
    const response = await fetch(`${baseUrl}/__s02/health`, { method: 'POST' });
    expect(response.status).toBe(405);
    await expect(response.text()).resolves.toBe('Method not allowed');
  });
});
