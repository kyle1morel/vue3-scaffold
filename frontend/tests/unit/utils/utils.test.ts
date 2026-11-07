import { getBatches, toIsoRange } from '@/utils/utils';

// Mocks

// Fixtures

// Mount

// Tests

describe('utils.ts', () => {
  describe('getBatches', () => {
    it('returns an empty array for an empty input', () => {
      expect(getBatches([], 2)).toStrictEqual([]);
    });

    it('returns a single batch when the input fits within size', () => {
      expect(getBatches([1, 2], 2)).toStrictEqual([[1, 2]]);
    });

    it('splits into full batches with a shorter last batch', () => {
      expect(getBatches([1, 2, 3, 4, 5], 2)).toStrictEqual([[1, 2], [3, 4], [5]]);
    });
  });

  describe('toIsoRange', () => {
    it('converts a complete range', () => {
      expect(toIsoRange([new Date('2025-01-01T00:00:00Z'), new Date('2025-01-31T00:00:00Z')])).toEqual([
        '2025-01-01T00:00:00.000Z',
        '2025-01-31T00:00:00.000Z'
      ]);
    });

    it.each([undefined, null, [new Date()], [new Date(), null]])('returns undefined for %j', (range) => {
      expect(toIsoRange(range)).toBeUndefined();
    });
  });
});
