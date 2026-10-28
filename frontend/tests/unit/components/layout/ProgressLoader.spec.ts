import ProgressLoader from '@/components/layout/ProgressLoader.vue';
import { ProgressBar } from '@/lib/primevue';

import { mountComponent } from '../../../mountComponent';

// Mocks

// Fixtures

// Mount

function mountProgressLoader(options: { loadingMode?: string; loadingValue?: number } = {}) {
  const { wrapper } = mountComponent(ProgressLoader, {
    piniaState: { app: { loadingMode: 'determinate', loadingValue: 0, ...options } }
  });

  return { wrapper };
}

// Tests

describe('ProgressLoader', () => {
  describe('rendering', () => {
    it('shows the loading progress from the app store', () => {
      const { wrapper } = mountProgressLoader({ loadingValue: 40 });
      const bar = wrapper.findComponent(ProgressBar);

      expect(bar.props('mode')).toBe('determinate');
      expect(bar.props('value')).toBe(40);
    });

    it('switches to indeterminate mode', () => {
      const { wrapper } = mountProgressLoader({ loadingMode: 'indeterminate' });

      expect(wrapper.findComponent(ProgressBar).props('mode')).toBe('indeterminate');
    });
  });
});
