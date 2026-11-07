import { flushPromises } from '@vue/test-utils';

import Checkbox from '@/components/form/Checkbox.vue';

import { mountWithFormContext } from '../../../mountWithFormContext';

// Mocks

// Fixtures

const testName = 'agree';

// Mount

function mountCheckbox(componentProps: Record<string, unknown> = {}) {
  const { wrapper, form } = mountWithFormContext(Checkbox, {
    componentProps: { name: testName, label: 'I accept the terms', ...componentProps }
  });

  return { wrapper, form, input: wrapper.find('[role="checkbox"]') };
}

// Tests

describe('Checkbox', () => {
  describe('rendering', () => {
    it('links the label to the checkbox', () => {
      const { wrapper, input } = mountCheckbox();

      expect(wrapper.find(`label[for="${input.attributes('id')}"]`).text()).toBe('I accept the terms');
    });

    it('marks the field as required', () => {
      const { wrapper, input } = mountCheckbox({ required: true });

      expect(wrapper.find('label').text()).toContain('(required)');
      expect(input.attributes('aria-required')).toBe('true');
    });

    it('describes the checkbox with its error', async () => {
      const { wrapper, form, input } = mountCheckbox();

      form.setFieldError(testName, 'You must accept the terms');
      await flushPromises();

      expect(input.attributes('aria-invalid')).toBe('true');
      expect(wrapper.find(`[id="${input.attributes('aria-describedby')}"]`).text()).toBe('You must accept the terms');
    });

    it('disables the checkbox', () => {
      const { input } = mountCheckbox({ disabled: true });

      expect(input.attributes('disabled')).toBeDefined();
    });
  });

  describe('user interaction', () => {
    it('sets the field to true when ticked', async () => {
      const { form, input } = mountCheckbox();

      await input.trigger('click');

      expect(form.values[testName]).toBe(true);
    });

    it('ignores clicks when read only', async () => {
      const { form, input } = mountCheckbox({ readonly: true });

      await input.trigger('click');

      expect(input.attributes('aria-readonly')).toBe('true');
      expect(input.attributes('aria-checked')).toBe('false');
      expect(form.values[testName]).toBeUndefined();
    });
  });
});
