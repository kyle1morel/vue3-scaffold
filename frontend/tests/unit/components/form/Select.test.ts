import BcdsSelect from '@/components/bcds/Select.vue';
import Select from '@/components/form/Select.vue';

import { mountWithFormContext } from '../../../mountWithFormContext';

// Mocks

// Fixtures

const testName = 'province';
const testOptions = [
  { label: 'Alberta', value: 'AB' },
  { label: 'British Columbia', value: 'BC' }
];

// Mount

function mountSelect(componentProps: Record<string, unknown> = {}) {
  const { wrapper, form } = mountWithFormContext(Select, {
    componentProps: {
      name: testName,
      label: 'Province',
      options: testOptions,
      optionLabel: 'label',
      optionValue: 'value',
      ...componentProps
    }
  });

  return { wrapper, form, select: wrapper.findComponent(BcdsSelect), combobox: wrapper.find('[role="combobox"]') };
}

// Tests

describe('Select', () => {
  describe('rendering', () => {
    it('labels the combobox', () => {
      const { wrapper, combobox } = mountSelect();

      expect(wrapper.find(`label[for="${combobox.attributes('id')}"]`).text()).toBe('Province');
    });

    it('marks the field as required', () => {
      const { wrapper, combobox } = mountSelect({ required: true });

      expect(wrapper.find('label').text()).toContain('(required)');
      expect(combobox.attributes('aria-required')).toBe('true');
    });

    it('passes the options to the select and disables it', () => {
      const { combobox, select } = mountSelect({ disabled: true });

      expect(select.props('options')).toEqual(testOptions);
      expect(combobox.attributes('disabled')).toBeDefined();
    });
  });

  describe('user interaction', () => {
    it('sets the field to the chosen option value', async () => {
      const { form, select } = mountSelect();

      await select.vm.$emit('update:modelValue', 'BC');

      expect(form.values[testName]).toBe('BC');
    });
  });

  describe('read only', () => {
    it('shows the chosen option label in a labelled read-only input', () => {
      const { wrapper } = mountWithFormContext(Select, {
        formProps: { initialValues: { [testName]: 'BC' } },
        componentProps: {
          name: testName,
          label: 'Province',
          options: testOptions,
          optionLabel: 'label',
          optionValue: 'value',
          readonly: true
        }
      });

      const input = wrapper.find('input');
      expect(input.attributes('readonly')).toBeDefined();
      expect((input.element as HTMLInputElement).value).toBe('British Columbia');
      expect(wrapper.find(`label[for="${input.attributes('id')}"]`).text()).toBe('Province');
    });
  });
});
