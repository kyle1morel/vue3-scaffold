import PrimeInputNumber from 'primevue/inputnumber';

import InputNumber from '@/components/form/InputNumber.vue';

import { mountWithFormContext } from '../../../mountWithFormContext';

// Mocks

// Fixtures

const testName = 'quantity';

// Mount

function mountInputNumber(componentProps: Record<string, unknown> = {}) {
  const { wrapper, form } = mountWithFormContext(InputNumber, {
    componentProps: { name: testName, label: 'Quantity', ...componentProps }
  });

  // Our wrapper shares PrimeVue's component name, so filtering by PrimeVue's root class picks the real one
  const inputNumber = wrapper.findAllComponents(PrimeInputNumber).find((match) => match.classes('p-inputnumber'));
  if (!inputNumber) throw new Error('PrimeVue InputNumber was not rendered');

  return { wrapper, form, inputNumber, input: wrapper.find('input') };
}

// Tests

describe('InputNumber', () => {
  describe('rendering', () => {
    it('links the label to the input', () => {
      const { wrapper, input } = mountInputNumber();

      expect(wrapper.find(`label[for="${input.attributes('id')}"]`).text()).toBe('Quantity');
    });

    it('describes the input with its help text', () => {
      const { wrapper, input } = mountInputNumber({ helpText: 'Between 1 and 100' });

      expect(wrapper.find(`[id="${input.attributes('aria-describedby')}"]`).text()).toBe('Between 1 and 100');
    });

    it('disables the input', () => {
      const { input } = mountInputNumber({ disabled: true });

      expect(input.attributes('disabled')).toBeDefined();
    });
  });

  describe('user interaction', () => {
    it('sets the field to the entered number', async () => {
      const { form, inputNumber } = mountInputNumber();

      await inputNumber.vm.$emit('update:modelValue', 3);

      expect(form.values[testName]).toBe(3);
    });
  });
});
