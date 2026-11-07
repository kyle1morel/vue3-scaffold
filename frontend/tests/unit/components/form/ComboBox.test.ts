import BcdsComboBox from '@/components/bcds/ComboBox.vue';
import ComboBox from '@/components/form/ComboBox.vue';

import { mountWithFormContext } from '../../../mountWithFormContext';

// Mocks

// Fixtures

const testName = 'city';
const testSuggestions = ['Kamloops', 'Kelowna'];

// Mount

function mountComboBox(options: { label?: string; required?: boolean } = {}) {
  const { wrapper } = mountWithFormContext(ComboBox, {
    componentProps: { name: testName, suggestions: testSuggestions, ...options }
  });

  return { wrapper, comboBox: wrapper.findComponent(ComboBox), input: wrapper.find('input') };
}

// Tests

describe('ComboBox', () => {
  describe('rendering', () => {
    it('renders the label', () => {
      const { wrapper } = mountComboBox({ label: 'City' });

      expect(wrapper.find('label').text()).toContain('City');
    });

    it('marks the field as required when asked to', () => {
      const { wrapper } = mountComboBox({ label: 'City', required: true });

      expect(wrapper.find('label').text()).toContain('(required)');
    });

    it('passes the suggestions to the input', () => {
      const { wrapper } = mountComboBox();

      expect(wrapper.findComponent(BcdsComboBox).props('suggestions')).toEqual(testSuggestions);
    });
  });

  describe('user interaction', () => {
    it('emits complete with the typed text once typing stops', async () => {
      vi.useFakeTimers();
      const { comboBox, input } = mountComboBox();

      await input.setValue('K');
      expect(comboBox.emitted('complete')).toBeUndefined();
      vi.advanceTimersByTime(300);

      expect(comboBox.emitted('complete')).toEqual([['K']]);
      vi.useRealTimers();
    });

    it('emits the chosen value when a suggestion is selected', async () => {
      const { comboBox, wrapper } = mountComboBox();

      await wrapper.findComponent({ name: 'ComboboxRoot' }).vm.$emit('update:modelValue', 'Kelowna');

      expect(comboBox.emitted('select')).toEqual([['Kelowna']]);
    });
  });
});
