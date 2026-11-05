import TextArea from '@/components/form/TextArea.vue';

import { mountWithFormContext } from '../../../mountWithFormContext';

// Mocks

// Fixtures

const testName = 'comments';

// Mount

function mountTextArea(componentProps: Record<string, unknown> = {}) {
  const { wrapper, form } = mountWithFormContext(TextArea, {
    componentProps: { name: testName, label: 'Comments', ...componentProps }
  });

  return { wrapper, form, textarea: wrapper.find('textarea') };
}

// Tests

describe('TextArea', () => {
  describe('rendering', () => {
    it('links the label to the textarea', () => {
      const { wrapper, textarea } = mountTextArea();

      expect(wrapper.find(`label[for="${textarea.attributes('id')}"]`).text()).toBe('Comments');
    });

    it('describes the textarea with its tooltip', () => {
      const { wrapper, textarea } = mountTextArea({ tooltip: 'Anything else we should know' });

      expect(wrapper.find(`[id="${textarea.attributes('aria-describedby')}"]`).text()).toBe(
        'Anything else we should know'
      );
    });

    it('disables the textarea', () => {
      const { textarea } = mountTextArea({ disabled: true });

      expect(textarea.attributes('disabled')).toBeDefined();
    });
  });

  describe('user interaction', () => {
    it('sets the field to the typed text', async () => {
      const { form, textarea } = mountTextArea();

      await textarea.setValue('Some comments');

      expect(form.values[testName]).toBe('Some comments');
    });
  });
});
