import PrimeAutoComplete from 'primevue/autocomplete';

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

  return { wrapper, comboBox: wrapper.findComponent(ComboBox), input: wrapper.findComponent(PrimeAutoComplete) };
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
      const { input } = mountComboBox();

      expect(input.props('suggestions')).toEqual(testSuggestions);
    });
  });

  describe('user interaction', () => {
    it('emits complete with the typed text', async () => {
      const { comboBox, input } = mountComboBox();
      const event = { originalEvent: new Event('input'), query: 'K' };

      await input.vm.$emit('complete', event);

      expect(comboBox.emitted('complete')).toEqual([['K']]);
    });

    it('emits the chosen value when a suggestion is selected', async () => {
      const { comboBox, input } = mountComboBox();

      await input.vm.$emit('option-select', { value: 'Kelowna' });

      expect(comboBox.emitted('select')).toEqual([['Kelowna']]);
    });
  });
});
