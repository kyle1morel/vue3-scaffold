import Spinner from '@/components/layout/Spinner.vue';

import { mountComponent } from '../../../mountComponent';

// Mocks

// Fixtures

// Mount

function mountSpinner() {
  const { wrapper } = mountComponent(Spinner);

  return { wrapper };
}

// Tests

describe('Spinner', () => {
  describe('rendering', () => {
    it('renders a labelled progress spinner', () => {
      const { wrapper } = mountSpinner();

      expect(wrapper.find('[aria-label="Loading"]').exists()).toBe(true);
    });
  });
});
