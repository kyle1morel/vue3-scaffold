import { flushPromises } from '@vue/test-utils';

import MaskedField from '@/components/form/MaskedField.vue';

import { mountWithFormContext } from '../../../mountWithFormContext';

// Mocks

// Fixtures

const testName = 'phone';
const testMask = '(###) ###-####';

// Mount

function mountMaskedField(componentProps: Record<string, unknown> = {}) {
  const { wrapper, form } = mountWithFormContext(MaskedField, {
    componentProps: { label: 'Phone', mask: testMask, name: testName, ...componentProps }
  });

  return { wrapper, form, input: wrapper.find('input') };
}

// Tests

describe('MaskedField', () => {
  describe('rendering', () => {
    it('links the label to the input', () => {
      const { wrapper, input } = mountMaskedField();

      expect(wrapper.find(`label[for="${input.attributes('id')}"]`).text()).toBe('Phone');
    });

    it('passes the input type through', () => {
      const { input } = mountMaskedField({ type: 'tel' });

      expect(input.attributes('type')).toBe('tel');
    });
  });

  describe('masking', () => {
    it('formats the typed text and keeps the formatted value', async () => {
      const { form, input } = mountMaskedField();

      await input.setValue('2505550100');
      await flushPromises();

      expect((input.element as HTMLInputElement).value).toBe('(250) 555-0100');
      expect(form.values[testName]).toBe('(250) 555-0100');
    });

    it('drops characters the mask has no place for', async () => {
      const { input } = mountMaskedField();

      await input.setValue('250abc5550100999');
      await flushPromises();

      expect((input.element as HTMLInputElement).value).toBe('(250) 555-0100');
    });

    it('clears the value when the field is emptied', async () => {
      const { form, input } = mountMaskedField();
      await input.setValue('2505550100');

      await input.setValue('');
      await flushPromises();

      expect(form.values[testName]).toBeUndefined();
    });
  });
});
