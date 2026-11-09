import { Form } from '@/components/bcds';

import { mountComponent } from '../../../mountComponent';

// Mocks

// Fixtures

// Mount

function mountForm(props: Record<string, unknown> = {}) {
  const { wrapper } = mountComponent(Form, { props });

  return { wrapper, form: wrapper.find('form') };
}

// Tests

describe('Form', () => {
  describe('validation behavior', () => {
    it('leaves validation to the browser by default', () => {
      const { form } = mountForm();

      expect(form.attributes('novalidate')).toBeUndefined();
    });

    it('turns off browser validation for aria', () => {
      const { form } = mountForm({ validationBehavior: 'aria' });

      expect(form.attributes('novalidate')).toBeDefined();
    });
  });

  describe('attributes', () => {
    it('passes classes and listeners to the form', async () => {
      const onSubmit = vi.fn((event: Event) => event.preventDefault());
      const { form } = mountForm({ class: 'grid', onSubmit });

      await form.trigger('submit');

      expect(form.classes()).toContain('grid');
      expect(onSubmit).toHaveBeenCalledOnce();
    });
  });
});
