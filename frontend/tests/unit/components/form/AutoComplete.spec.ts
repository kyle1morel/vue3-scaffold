import AutoComplete from '@/components/form/AutoComplete.vue';
import { AutoComplete as PrimeAutoComplete } from '@/lib/primevue';

import { mountWithFormContext } from '../../../mountWithFormContext';

// Mocks

// Fixtures

const testName = 'city';
const testSuggestions = ['Kamloops', 'Kelowna'];

// Mount

function mountAutoComplete(options: { label?: string; required?: boolean } = {}) {
  const { wrapper } = mountWithFormContext(AutoComplete, {
    componentProps: { name: testName, suggestions: testSuggestions, ...options }
  });

  // PrimeVue's component shares the name AutoComplete, so findComponent can resolve to our wrapper;
  // filtering every match by PrimeVue's root class picks the real input
  const input = wrapper.findAllComponents(PrimeAutoComplete).find((match) => match.classes('p-autocomplete'));
  if (!input) throw new Error('PrimeVue AutoComplete was not rendered');

  return { wrapper, autoComplete: wrapper.findComponent(AutoComplete), input };
}

// Tests

describe('AutoComplete', () => {
  describe('rendering', () => {
    it('renders the label', () => {
      const { wrapper } = mountAutoComplete({ label: 'City' });

      expect(wrapper.find(`#${testName}-label`).text()).toContain('City');
    });

    it('marks the field as required when asked to', () => {
      const { wrapper } = mountAutoComplete({ label: 'City', required: true });

      expect(wrapper.find(`#${testName}-label`).text()).toContain('*');
    });

    it('passes the suggestions to the input', () => {
      const { input } = mountAutoComplete();

      expect(input.props('suggestions')).toEqual(testSuggestions);
    });
  });

  describe('user interaction', () => {
    it('emits complete when the user types', async () => {
      const { autoComplete, input } = mountAutoComplete();
      const event = { originalEvent: new Event('input'), query: 'K' };

      await input.vm.$emit('complete', event);

      expect(autoComplete.emitted('complete')).toEqual([[event]]);
    });

    it('emits the chosen value when a suggestion is selected', async () => {
      const { autoComplete, input } = mountAutoComplete();

      await input.vm.$emit('option-select', { value: 'Kelowna' });

      expect(autoComplete.emitted('select')).toEqual([['Kelowna']]);
    });
  });
});
