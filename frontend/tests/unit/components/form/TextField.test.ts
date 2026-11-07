import PrimeInputMask from 'primevue/inputmask';

import TextField from '@/components/form/TextField.vue';

import { mountWithFormContext } from '../../../mountWithFormContext';

// Mocks

// Fixtures

const testName = 'firstName';
const testMask = '(999) 999-9999';

// Mount

function mountTextField(componentProps: Record<string, unknown> = {}) {
  const { wrapper, form } = mountWithFormContext(TextField, { componentProps: { name: testName, ...componentProps } });

  const input = wrapper.find('input');
  const described = () =>
    (input.attributes('aria-describedby') ?? '')
      .split(' ')
      .map((id) => wrapper.find(`[id="${id}"]`))
      .map((el) => el.attributes('aria-label') ?? el.text());

  return { wrapper, form, input, described };
}

// Tests

describe('TextField', () => {
  describe('rendering', () => {
    it('links the label to the input', () => {
      const { wrapper, input } = mountTextField({ label: 'First name' });

      expect(wrapper.find(`label[for="${input.attributes('id')}"]`).text()).toBe('First name');
    });

    it('describes the input with its description', () => {
      const { described } = mountTextField({ description: 'As on your ID' });

      expect(described()).toEqual(['As on your ID']);
    });

    it('marks the field as required', () => {
      const { wrapper, input } = mountTextField({ label: 'First name', required: true });

      expect(wrapper.find('label').text()).toContain('(required)');
      expect(input.attributes('aria-required')).toBe('true');
    });

    it('passes the placeholder and disabled state to the input', () => {
      const { input } = mountTextField({ disabled: true, placeholder: 'Jane' });

      expect(input.attributes('placeholder')).toBe('Jane');
      expect(input.attributes('disabled')).toBeDefined();
    });

    it('keeps the class on the wrapper', () => {
      const { wrapper, input } = mountTextField({ class: 'col-span-6' });

      expect(wrapper.find('.col-span-6').element.contains(input.element)).toBe(true);
      expect(input.classes()).not.toContain('col-span-6');
    });
  });

  describe('mask', () => {
    it('passes the mask to the input', () => {
      const { wrapper } = mountTextField({ mask: testMask });

      expect(wrapper.findComponent(PrimeInputMask).props('mask')).toBe(testMask);
    });

    it('clears the field when the mask is emptied', async () => {
      const { form, wrapper } = mountTextField({ mask: testMask });
      form.setFieldValue(testName, '(250) 555-1234');

      await wrapper.findComponent(PrimeInputMask).vm.$emit('update:modelValue', '');

      expect(form.values[testName]).toBeUndefined();
    });
  });
});
