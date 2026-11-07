import NumberField from '@/components/form/NumberField.vue';

import { mountWithFormContext } from '../../../mountWithFormContext';

// Mocks

// Fixtures

const testName = 'quantity';

// Mount

function mountNumberField(componentProps: Record<string, unknown> = {}) {
  const { wrapper, form } = mountWithFormContext(NumberField, {
    componentProps: { name: testName, label: 'Quantity', ...componentProps }
  });

  return { wrapper, form, input: wrapper.find('input') };
}

// Tests

describe('NumberField', () => {
  describe('rendering', () => {
    it('links the label to the input', () => {
      const { wrapper, input } = mountNumberField();

      expect(wrapper.find(`label[for="${input.attributes('id')}"]`).text()).toBe('Quantity');
    });

    it('describes the input with its description', () => {
      const { wrapper, input } = mountNumberField({ description: 'Between 1 and 100' });

      expect(wrapper.find(`[id="${input.attributes('aria-describedby')}"]`).text()).toBe('Between 1 and 100');
    });

    it('disables the input', () => {
      const { input } = mountNumberField({ disabled: true });

      expect(input.attributes('disabled')).toBeDefined();
    });
  });

  describe('user interaction', () => {
    it('sets the field to the entered number', async () => {
      const { form, input } = mountNumberField();

      await input.setValue('3');
      await input.trigger('blur');

      expect(form.values[testName]).toBe(3);
    });
  });
});
