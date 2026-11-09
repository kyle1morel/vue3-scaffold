import DatePicker from '@/components/form/DatePicker.vue';

import { mountWithFormContext } from '../../../mountWithFormContext';

// Mocks

// Fixtures

const testName = 'startDate';

// Mount

function mountDatePicker(options: { description?: string; label?: string; required?: boolean } = {}) {
  const { wrapper } = mountWithFormContext(DatePicker, { componentProps: { name: testName, ...options } });

  return { wrapper };
}

// Tests

describe('DatePicker', () => {
  describe('rendering', () => {
    it('names the date segments with the label, and describes them with the format hint and description', () => {
      const { wrapper } = mountDatePicker({ label: 'Start date', description: 'Pick a day' });

      // The date is typed in separate segments, so their group is named rather than one input.
      const field = wrapper.find('[aria-labelledby]');
      const description = wrapper.find(`[id="${field.attributes('aria-describedby')}"]`).text();
      expect(wrapper.find(`[id="${field.attributes('aria-labelledby')}"]`).text()).toContain('Start date');
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
