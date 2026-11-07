import LocaleChanger from '@/components/common/LocaleChanger.vue';
import { SUPPORT_LOCALES } from '@/i18n';
import { Select } from '@/lib/primevue';

import { mountComponent } from '../../../mountComponent';

// Mocks

// Fixtures

// Mount

function mountLocaleChanger() {
  const { wrapper } = mountComponent(LocaleChanger);

  return { wrapper };
}

// Tests

describe('LocaleChanger', () => {
  describe('rendering', () => {
    it('offers the supported locales and selects the current one', () => {
      const { wrapper } = mountLocaleChanger();
      const select = wrapper.findComponent(Select);

      expect(select.props('options')).toEqual(SUPPORT_LOCALES);
      expect(select.props('modelValue')).toBe('en-CA');
    });
  });
});
