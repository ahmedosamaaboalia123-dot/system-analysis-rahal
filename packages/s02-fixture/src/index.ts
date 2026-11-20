export function increment(value: number): number {
  if (!Number.isSafeInteger(value) || value < 0 || value >= Number.MAX_SAFE_INTEGER) {
    throw new RangeError('Expected a non-negative safe integer with room to increment');
  }
  return value + 1;
}

export const fixtureLabel = 'MADAR S02 — TEST FIXTURE ONLY';
