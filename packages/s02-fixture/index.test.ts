import { describe, expect, it } from 'vitest';
import { fixtureLabel, increment } from './src/index.js';

describe('test-only fixture', () => {
  it('increments a typed value', () => expect(increment(3)).toBe(4));
  it('rejects non-integers', () => expect(() => increment(0.5)).toThrow(RangeError));
  it('rejects overflow', () =>
    expect(() => increment(Number.MAX_SAFE_INTEGER)).toThrow(RangeError));
  it('handles the lower boundary', () => expect(increment(0)).toBe(1));
  it('is deterministic', () => expect(increment(12)).toBe(increment(12)));
  it('labels its purpose', () => expect(fixtureLabel).toContain('TEST FIXTURE ONLY'));
});
