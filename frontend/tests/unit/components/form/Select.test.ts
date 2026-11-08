import BcdsSelect from '@/components/bcds/Select.vue';
import Select from '@/components/form/Select.vue';

import { mountWithFormContext } from '../../../mountWithFormContext';

// Mocks

// Fixtures

const testName = 'province';
const testItems = [
  { id: 'AB', label: 'Alberta' },
  { id: 'BC', label: 'British Columbia' }
];

// Mount

function mountSelect(componentProps: Record<string, unknown> = {}) {
  const { wrapper, form } = mountWithFormContext(Select, {
    componentProps: {
      name: testName,
      label: 'Province',
      items: testItems,
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

    it('shows a placeholder until an option is chosen', () => {
      const { combobox } = mountSelect();

      expect(combobox.text()).toContain('Select an item');
    });

    it('passes the items to the select and disables it', () => {
      const { combobox, select } = mountSelect({ disabled: true });

      expect(select.props('items')).toEqual(testItems);
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

  describe('multiple selection', () => {
    function mountMultiple(componentProps: Record<string, unknown> = {}) {
      return mountWithFormContext(Select, {
        formProps: { initialValues: { [testName]: ['AB', 'BC'] } },
        componentProps: {
          name: testName,
          label: 'Province',
          items: testItems,
          selectionMode: 'multiple',
          ...componentProps
        }
      });
    }

    it('shows each chosen option as a tag in a labelled group', () => {
      const { wrapper } = mountMultiple();

      const group = wrapper.find('[role="group"]');
      expect(group.attributes('aria-label')).toBe('Province selections');
      expect(group.findAll('.tag-label').map((tag) => tag.text())).toEqual(['Alberta', 'British Columbia']);
      expect(wrapper.find('[role="combobox"]').text()).not.toContain('Select an item');
    });

    it('removes an option from the field when its tag is removed', async () => {
      const { wrapper, form } = mountMultiple();

      await wrapper.find('button[aria-label="Remove Alberta"]').trigger('click');

      expect(form.values[testName]).toEqual(['BC']);
    });

    it('greys out the tags and hides their remove buttons when disabled', () => {
      const { wrapper } = mountMultiple({ disabled: true });

      expect(wrapper.findAll('.tag').every((tag) => tag.classes('disabled'))).toBe(true);
      expect(wrapper.find('button.remove').exists()).toBe(false);
    });
  });

  describe('read only', () => {
    it('shows the chosen option label in a labelled read-only input', () => {
      const { wrapper } = mountWithFormContext(Select, {
        formProps: { initialValues: { [testName]: 'BC' } },
        componentProps: {
          name: testName,
          label: 'Province',
          items: testItems,
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
