import { describe, expect, it } from 'vitest';
import { buildStats, getNextIndex } from '../citations.ts';
import type { VerificationResult } from '../../../../types/index.ts';

const RESULTS: VerificationResult[] = [
  {
    id: 'ver-1',
    citationId: 'cit-1',
    status: 'not_found',
    severity: 'critical',
    message: 'Missing citation.',
  },
  {
    id: 'ver-2',
    citationId: 'cit-2',
    status: 'quote_mismatch',
    severity: 'warning',
    message: 'Quote mismatch.',
  },
  {
    id: 'ver-3',
    citationId: 'cit-3',
    status: 'overruled',
    severity: 'warning',
    message: 'Overruled case.',
  },
  {
    id: 'ver-4',
    citationId: 'cit-4',
    status: 'valid',
    severity: 'none',
    message: 'Verified.',
  },
];

describe('buildStats', () => {
  it('counts severities correctly', () => {
    const stats = buildStats(RESULTS.length, RESULTS);

    expect(stats).toEqual({
      total: 4,
      verified: 1,
      warning: 2,
      critical: 1,
    });
  });
});

describe('getNextIndex', () => {
  it('wraps when moving forward', () => {
    expect(getNextIndex(2, 1, 3)).toBe(0);
  });

  it('wraps when moving backward', () => {
    expect(getNextIndex(0, -1, 3)).toBe(2);
  });

  it('returns -1 for empty lists', () => {
    expect(getNextIndex(-1, 1, 0)).toBe(-1);
  });
});
