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
    it('renders the label and help text with ids based on the name', () => {
      const { wrapper } = mountDatePicker({ label: 'Start date', helpText: 'Pick a day' });

      expect(wrapper.find(`#${testName}-label`).text()).toContain('Start date');
      expect(wrapper.find(`#${testName}-help`).text()).toBe('Pick a day');
    });

    it('omits the label when none is given', () => {
      const { wrapper } = mountDatePicker();

      expect(wrapper.find('label').exists()).toBe(false);
    });

    it('marks the field as required when asked to', () => {
      const { wrapper } = mountDatePicker({ label: 'Start date', required: true });

      expect(wrapper.find(`#${testName}-label`).text()).toContain('*');
    });
  });
});
