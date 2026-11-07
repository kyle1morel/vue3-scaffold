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

  return { wrapper, form, group: wrapper.find('fieldset'), radios: wrapper.findAll('input[type="radio"]') };
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

    it('names the group with its legend and marks every radio as required', () => {
      const { group, radios } = mountRadioGroup({ required: true });

      expect(group.find('legend').text()).toContain('Contact method');
      expect(group.find('legend').text()).toContain('(required)');
      expect(radios.every((radio) => radio.attributes('required') !== undefined)).toBe(true);
    });

    it('disables every radio', () => {
      const { radios } = mountRadioGroup({ disabled: true });

      expect(radios.every((radio) => radio.attributes('disabled') !== undefined)).toBe(true);
    });
  });

  describe('user interaction', () => {
    it('sets the field to the chosen option value', async () => {
      const { form, wrapper } = mountRadioGroup();

      await wrapper.find('input[value="phone"]').setValue(true);

      expect(form.values[testName]).toBe('phone');
    });

    it('ignores clicks when read only', async () => {
      const { form, wrapper } = mountRadioGroup({ readonly: true });
      const phone = wrapper.find('input[value="phone"]');

      await phone.trigger('click');

      expect((phone.element as HTMLInputElement).checked).toBe(false);
      expect(form.values[testName]).toBeUndefined();
    });
  });
});
