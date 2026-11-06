import PrimeSelect from 'primevue/select';

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

  // Our wrapper shares PrimeVue's component name, so filtering by PrimeVue's root class picks the real one
  const select = wrapper.findAllComponents(PrimeSelect).find((match) => match.classes('p-select'));
  if (!select) throw new Error('PrimeVue Select was not rendered');

  return { wrapper, form, select, combobox: wrapper.find('[role="combobox"]') };
}

// Tests

describe('Select', () => {
  describe('rendering', () => {
    it('labels the combobox', () => {
      const { wrapper, combobox } = mountSelect();

      expect(wrapper.find(`[id="${combobox.attributes('aria-labelledby')}"]`).text()).toBe('Province');
    });

    it('marks the field as required', () => {
      const { wrapper, combobox } = mountSelect({ required: true });

      expect(wrapper.find('label').text()).toContain('*');
      expect(combobox.attributes('aria-required')).toBe('true');
    });

    it('passes the options and disabled state to the select', () => {
      const { select } = mountSelect({ disabled: true });

      expect(select.props('options')).toEqual(testOptions);
      expect(select.props('disabled')).toBe(true);
    });
  });

  describe('user interaction', () => {
    it('sets the field to the chosen option value', async () => {
      const { form, select } = mountSelect();

      await select.vm.$emit('update:modelValue', 'BC');

      expect(form.values[testName]).toBe('BC');
    });
  });

  describe('editable', () => {
    it('links the label to the input', () => {
      const { wrapper } = mountSelect({ editable: true });

      const input = wrapper.find('input[type="text"]');
      expect(wrapper.find(`label[for="${input.attributes('id')}"]`).text()).toBe('Province');
    });

    it('sets the field to typed text that matches no option', async () => {
      const { form, wrapper } = mountSelect({ editable: true });

      await wrapper.find('input[type="text"]').setValue('Yukon');

      expect(form.values[testName]).toBe('Yukon');
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
