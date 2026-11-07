import { ToastTimeout } from '@/utils/enums';
import { getBatches, rethrowAs, showError, toIsoRange, UserError } from '@/utils/utils';

// Mocks

const mockToast = { error: vi.fn(), info: vi.fn(), success: vi.fn(), warn: vi.fn() };

vi.mock('@/lib/primevue/useToast', () => ({
  useToast: () => mockToast
}));

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

  describe('rethrowAs', () => {
    it('rejects with a UserError carrying the message and the original error', async () => {
      const cause = new Error('network down');

      const error = await Promise.reject(cause)
        .catch(rethrowAs('Unable to save'))
        .catch((e: unknown) => e);

      expect(error).toBeInstanceOf(UserError);
      expect(error).toMatchObject({ message: 'Unable to save', cause });
    });
  });

  describe('showError', () => {
    beforeEach(() => {
      vi.clearAllMocks();
      vi.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('shows a UserError message as it is', () => {
      showError(new UserError('Unable to save'));

      expect(mockToast.error).toHaveBeenCalledWith('Unable to save');
    });

    it('shows a generic message that stays open for any other error', () => {
      showError(new Error('Request failed with status code 500'));

      expect(mockToast.error).toHaveBeenCalledWith('Something went wrong. Please try again.', '', {
        life: ToastTimeout.STICKY
      });
    });
  });
});
