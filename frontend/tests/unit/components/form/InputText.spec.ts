import InputText from '@/components/form/InputText.vue';

import { mountWithFormContext } from '../../../mountWithFormContext';

// Mocks

// Fixtures

const testName = 'firstName';

// Mount

function mountInputText(componentProps: Record<string, unknown> = {}) {
  const { wrapper } = mountWithFormContext(InputText, { componentProps: { name: testName, ...componentProps } });

  const input = wrapper.find('input');
  const described = () =>
    (input.attributes('aria-describedby') ?? '')
      .split(' ')
      .map((id) => wrapper.find(`[id="${id}"]`))
      .map((el) => el.attributes('aria-label') ?? el.text());

  return { wrapper, input, described };
}

// Tests

describe('InputText', () => {
  describe('rendering', () => {
    it('links the label to the input', () => {
      const { wrapper, input } = mountInputText({ label: 'First name' });

      expect(wrapper.find(`label[for="${input.attributes('id')}"]`).text()).toBe('First name');
    });

    it('describes the input with its tooltip and help text', () => {
      const { described } = mountInputText({ helpText: 'As on your ID', tooltip: 'Your legal name' });

      expect(described()).toEqual(['Your legal name', 'As on your ID']);
    });

    it('marks the field as required', () => {
      const { wrapper, input } = mountInputText({ label: 'First name', required: true });

      expect(wrapper.find('label').text()).toContain('*');
      expect(input.attributes('aria-required')).toBe('true');
    });

    it('passes the placeholder and disabled state to the input', () => {
      const { input } = mountInputText({ disabled: true, placeholder: 'Jane' });

      expect(input.attributes('placeholder')).toBe('Jane');
      expect(input.attributes('disabled')).toBeDefined();
    });

    it('keeps the class on the wrapper', () => {
      const { wrapper, input } = mountInputText({ class: 'col-span-6' });

      expect(wrapper.find('.col-span-6').element.contains(input.element)).toBe(true);
      expect(input.classes()).not.toContain('col-span-6');
    });
  });
});
