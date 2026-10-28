import CopyToClipboard from '@/components/form/CopyToClipboard.vue';
import { ButtonMode } from '@/utils/enums/application';

import { mountComponent } from '../../../mountComponent';

// Mocks

// Fixtures

const testText = 'copy me';

// Mount

function mountCopyToClipboard(options: { mode?: ButtonMode } = {}) {
  const { wrapper } = mountComponent(CopyToClipboard, { props: { toCopy: testText, ...options } });

  return { wrapper };
}

beforeEach(() => {
  vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue();
});

afterEach(() => {
  vi.restoreAllMocks();
});

// Tests

describe('CopyToClipboard', () => {
  describe('rendering', () => {
    it('renders a labelled button by default', () => {
      const { wrapper } = mountCopyToClipboard();

      expect(wrapper.text()).toContain('Copy to clipboard');
    });

    it('renders an icon-only button in icon mode', () => {
      const { wrapper } = mountCopyToClipboard({ mode: ButtonMode.ICON });

      expect(wrapper.text()).not.toContain('Copy to clipboard');
    });
  });

  describe('user interaction', () => {
    it('copies the text when clicked', async () => {
      const { wrapper } = mountCopyToClipboard();

      await wrapper.find('button').trigger('click');

      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(testText);
    });
  });
});
