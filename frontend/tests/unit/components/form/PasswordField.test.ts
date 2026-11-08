import PasswordField from '@/components/form/PasswordField.vue';

import { mountComponent } from '../../../mountComponent';

// Mocks

// Fixtures

// Mount

function mountPasswordField(options: { props?: Record<string, unknown> } = {}) {
  const { wrapper } = mountComponent(PasswordField, { props: { name: 'account.password', ...options.props } });

  return { wrapper, input: () => wrapper.find('input'), toggle: () => wrapper.find('button') };
}

beforeEach(() => {
  vi.clearAllMocks();
});

// Tests

describe('PasswordField', () => {
  describe('rendering', () => {
    it('renders a password input bound to the given name', () => {
      const { input } = mountPasswordField();

      expect(input().attributes('type')).toBe('password');
      expect(input().attributes('name')).toBe('account.password');
    });

    it('passes placeholder through to the input', () => {
      const { input } = mountPasswordField({ props: { placeholder: 'Enter password' } });

      expect(input().attributes('placeholder')).toBe('Enter password');
    });

    it('renders the label text', () => {
      const { wrapper } = mountPasswordField({ props: { label: 'Password' } });

      expect(wrapper.find('label').text()).toBe('Password');
    });

    it('links the description to the input', () => {
      const { wrapper, input } = mountPasswordField({ props: { description: 'Must be at least 8 characters' } });

      const describedBy = input().attributes('aria-describedby');
      expect(wrapper.find(`[id="${describedBy}"]`).text()).toBe('Must be at least 8 characters');
    });

    it('disables the toggle with the field', () => {
      const { toggle } = mountPasswordField({ props: { disabled: true } });

      expect(toggle().attributes('disabled')).toBeDefined();
    });
  });

  describe('show/hide toggle', () => {
    it('starts hidden, with a button to show the password', () => {
      const { toggle } = mountPasswordField();

      expect(toggle().attributes('aria-label')).toBe('Show password');
      expect(toggle().attributes('aria-pressed')).toBe('false');
      expect(toggle().attributes('type')).toBe('button');
    });

    it('shows the password when pressed and hides it again', async () => {
      const { input, toggle } = mountPasswordField();

      await toggle().trigger('click');

      expect(input().attributes('type')).toBe('text');
      expect(toggle().attributes('aria-label')).toBe('Hide password');
      expect(toggle().attributes('aria-pressed')).toBe('true');

      await toggle().trigger('click');

      expect(input().attributes('type')).toBe('password');
      expect(toggle().attributes('aria-pressed')).toBe('false');
    });
  });
});
