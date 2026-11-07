import RadioGroup from '@/components/form/RadioGroup.vue';

import { mountWithFormContext } from '../../../mountWithFormContext';

// Mocks

// Fixtures

const testName = 'contactMethod';
const testOptions = [
  { label: 'Email', value: 'email' },
  { label: 'Phone', value: 'phone' }
];

// Mount

function mountRadioGroup(componentProps: Record<string, unknown> = {}) {
  const { wrapper, form } = mountWithFormContext(RadioGroup, {
    componentProps: { name: testName, label: 'Contact method', options: testOptions, ...componentProps }
  });

  return { wrapper, form, group: wrapper.find('[role="radiogroup"]'), radios: wrapper.findAll('[role="radio"]') };
}

// Tests

describe('RadioGroup', () => {
  describe('rendering', () => {
    it('links each option label to its radio', () => {
      const { wrapper, radios } = mountRadioGroup();

      expect(radios.map((radio) => wrapper.find(`label[for="${radio.attributes('id')}"]`).text())).toEqual([
        'Email',
        'Phone'
      ]);
    });

    it('names the group with its label and marks it as required', () => {
      const { wrapper, group } = mountRadioGroup({ required: true });
      const label = wrapper.find(`[id="${group.attributes('aria-labelledby')}"]`);

      expect(label.text()).toContain('Contact method');
      expect(label.text()).toContain('(required)');
      expect(group.attributes('aria-required')).toBe('true');
    });

    it('disables every radio', () => {
      const { radios } = mountRadioGroup({ disabled: true });

      expect(radios.every((radio) => radio.attributes('disabled') !== undefined)).toBe(true);
    });
  });

  describe('user interaction', () => {
    it('sets the field to the chosen option value', async () => {
      const { form, radios } = mountRadioGroup();

      await radios[1]!.trigger('click');

      expect(form.values[testName]).toBe('phone');
    });

    it('ignores clicks when read only', async () => {
      const { form, radios } = mountRadioGroup({ readonly: true });
      const phone = radios[1]!;

      await phone.trigger('click');

      expect(phone.attributes('aria-checked')).toBe('false');
      expect(form.values[testName]).toBeUndefined();
    });
  });
});
