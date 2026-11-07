import { flushPromises } from '@vue/test-utils';

import OidcLogoutView from '@/views/oidc/OidcLogoutView.vue';

import { mockAuthNStore, resetMockAuthNStore } from '../../../mockAuthNStore';
import { mockRouter, resetMockRouter } from '../../../mockRouter';
import { mountComponent } from '../../../mountComponent';

// Mocks

vi.mock('@/store/authnStore', () => ({
  default: () => mockAuthNStore,
  useAuthNStore: () => mockAuthNStore
}));

vi.mock('vue-router', () => ({
  useRouter: () => mockRouter
}));

// Fixtures

// Mount

async function mountOidcLogoutView() {
  const { wrapper } = mountComponent(OidcLogoutView, { stubs: { Spinner: true } });
  await flushPromises();

  return { wrapper };
}

beforeEach(() => {
  resetMockAuthNStore();
  resetMockRouter();
});

// Tests

describe('OidcLogoutView', () => {
  describe('rendering', () => {
    it('renders the logging out message', async () => {
      const { wrapper } = await mountOidcLogoutView();

      expect(wrapper.text()).toContain('Logging out...');
    });
  });

  describe('logout', () => {
    it('logs out and returns to the home page', async () => {
      mockAuthNStore.getIsAuthenticated.value = true;

      await mountOidcLogoutView();

      expect(mockAuthNStore.logout).toHaveBeenCalledOnce();
      expect(mockRouter.replace).toHaveBeenCalledWith('/');
    });
  });
});
