import PrimeInputMask from 'primevue/inputmask';

import InputMask from '@/components/form/InputMask.vue';

import { mountWithFormContext } from '../../../mountWithFormContext';

// Mocks

// Fixtures

const testName = 'phone';
const testMask = '(999) 999-9999';

// Mount

function mountInputMask(componentProps: Record<string, unknown> = {}) {
  const { wrapper, form } = mountWithFormContext(InputMask, {
    componentProps: { name: testName, label: 'Phone', mask: testMask, ...componentProps }
  });

  // Our wrapper shares PrimeVue's component name, so filtering by PrimeVue's root class picks the real one
  const inputMask = wrapper.findAllComponents(PrimeInputMask).find((match) => match.classes('p-inputmask'));
  if (!inputMask) throw new Error('PrimeVue InputMask was not rendered');

  return { wrapper, form, inputMask, input: wrapper.find('input') };
}

// Tests

describe('InputMask', () => {
  describe('rendering', () => {
    it('links the label to the input', () => {
      const { wrapper, input } = mountInputMask();

      expect(wrapper.find(`label[for="${input.attributes('id')}"]`).text()).toBe('Phone');
    });

    it('passes the mask, placeholder and disabled state to the input', () => {
      const { input, inputMask } = mountInputMask({ disabled: true, placeholder: '(250) 555-1234' });

      expect(inputMask.props('mask')).toBe(testMask);
      expect(input.attributes('placeholder')).toBe('(250) 555-1234');
      expect(input.attributes('disabled')).toBeDefined();
    });
  });

  describe('user interaction', () => {
    it('clears the field when the mask is emptied', async () => {
      const { form, inputMask } = mountInputMask();
      form.setFieldValue(testName, '(250) 555-1234');

      await inputMask.vm.$emit('update:modelValue', '');

      expect(form.values[testName]).toBeUndefined();
    });
  });
});
