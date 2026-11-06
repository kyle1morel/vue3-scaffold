import DatePicker from '@/components/form/DatePicker.vue';

import { mountWithFormContext } from '../../../mountWithFormContext';

// Mocks

// Fixtures

const testName = 'startDate';

// Mount

function mountDatePicker(options: { helpText?: string; label?: string; required?: boolean } = {}) {
  const { wrapper } = mountWithFormContext(DatePicker, { componentProps: { name: testName, ...options } });

  return { wrapper };
}

// Tests

describe('DatePicker', () => {
  describe('rendering', () => {
    it('links the label, format hint and help text to the input', () => {
      const { wrapper } = mountDatePicker({ label: 'Start date', helpText: 'Pick a day' });

      const input = wrapper.find('input');
      const description = wrapper.find(`[id="${input.attributes('aria-describedby')}"]`).text();
      expect(wrapper.find(`label[for="${input.attributes('id')}"]`).text()).toContain('Start date');
      expect(description).toContain('Format: year - month - day');
      expect(description).toContain('Pick a day');
    });

    it('omits the label when none is given', () => {
      const { wrapper } = mountDatePicker();

      expect(wrapper.find('label').exists()).toBe(false);
    });

    it('marks the field as required when asked to', () => {
      const { wrapper } = mountDatePicker({ label: 'Start date', required: true });

      expect(wrapper.find('label').text()).toContain('(required)');
    });
  });
});
