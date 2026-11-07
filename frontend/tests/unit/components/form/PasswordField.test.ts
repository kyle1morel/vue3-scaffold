import PasswordField from '@/components/form/PasswordField.vue';

import { mountComponent } from '../../../mountComponent';

// Mocks

// Fixtures

// Mount

function findPvPassword(wrapper: ReturnType<typeof mountPasswordField>['wrapper']) {
  return wrapper.findComponent({ name: 'Password' });
}

function mountPasswordField(options: { props?: Record<string, unknown> } = {}) {
  const { wrapper } = mountComponent(PasswordField, { props: { name: 'account.password', ...options.props } });

  return { wrapper };
}

beforeEach(() => {
  vi.clearAllMocks();
});

// Tests

describe('PasswordField', () => {
  describe('rendering', () => {
    it('renders a PrimeVue Password bound to the given name', () => {
      const { wrapper } = mountPasswordField();

      const pvPassword = findPvPassword(wrapper);
      expect(pvPassword.exists()).toBe(true);
      expect(pvPassword.props('name')).toBe('account.password');
    });

    it('disables the feedback panel and enables the mask toggle', () => {
      const { wrapper } = mountPasswordField();

      const pvPassword = findPvPassword(wrapper);
      expect(pvPassword.props('feedback')).toBe(false);
      expect(pvPassword.props('toggleMask')).toBe(true);
    });

    it('passes placeholder through as a prop', () => {
      const { wrapper } = mountPasswordField({ props: { placeholder: 'Enter password' } });

      expect(findPvPassword(wrapper).props('placeholder')).toBe('Enter password');
    });

    // PrimeVue's Password has no `type` prop of its own -- `type` falls
    // through as a plain HTML attribute onto the underlying input.
    it('passes type through as a fallthrough attribute on the input', () => {
      const { wrapper } = mountPasswordField({ props: { type: 'password' } });

      expect(wrapper.find('input').attributes('type')).toBe('password');
    });

    it('renders the label text', () => {
      const { wrapper } = mountPasswordField({ props: { label: 'Password' } });

      expect(wrapper.find('label').text()).toBe('Password');
    });

    it('links the description to the input', () => {
      const { wrapper } = mountPasswordField({ props: { description: 'Must be at least 8 characters' } });

      const describedBy = wrapper.find('input').attributes('aria-describedby');
      expect(wrapper.find(`[id="${describedBy}"]`).text()).toBe('Must be at least 8 characters');
    });
  });
});
