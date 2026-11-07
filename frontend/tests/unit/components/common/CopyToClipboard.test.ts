import { flushPromises } from '@vue/test-utils';

import CopyToClipboard from '@/components/common/CopyToClipboard.vue';
import { showError } from '@/utils/utils';

import { mountComponent } from '../../../mountComponent';

// Mocks

const mockToast = { error: vi.fn(), info: vi.fn(), success: vi.fn(), warn: vi.fn() };

vi.mock('@/lib/primevue/useToast', () => ({
  useToast: () => mockToast
}));

// Fixtures

const testText = 'copy me';

// Mount

function mountCopyToClipboard(options: { iconOnly?: boolean } = {}) {
  const { wrapper } = mountComponent(CopyToClipboard, {
    errorHandler: showError,
    props: { toCopy: testText, ...options }
  });

  return { wrapper, button: wrapper.find('button') };
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue();
});

afterEach(() => {
  vi.restoreAllMocks();
});

// Tests

describe('CopyToClipboard', () => {
  describe('rendering', () => {
    it('renders a labelled button by default', () => {
      const { button } = mountCopyToClipboard();

      expect(button.text()).toBe('Copy to clipboard');
    });

    it('names an icon-only button for screen readers', () => {
      const { button } = mountCopyToClipboard({ iconOnly: true });

      expect(button.text()).toBe('');
      expect(button.attributes('aria-label')).toBe('Copy to clipboard');
    });
  });

  describe('user interaction', () => {
    it('copies the text and confirms it', async () => {
      const { button } = mountCopyToClipboard();

      await button.trigger('click');
      await flushPromises();

      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(testText);
      expect(mockToast.info).toHaveBeenCalledWith('Copied to clipboard');
    });

    it('shows an error when the copy fails', async () => {
      vi.mocked(navigator.clipboard.writeText).mockRejectedValue(new Error('denied'));
      const { button } = mountCopyToClipboard();

      await button.trigger('click');
      await flushPromises();

      expect(mockToast.error).toHaveBeenCalledWith('Unable to copy to the clipboard');
      expect(mockToast.info).not.toHaveBeenCalled();
    });
  });
});
