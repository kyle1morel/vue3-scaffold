import { flushPromises } from '@vue/test-utils';

import { RouteName, StorageKey } from '@/utils/enums/application';
import OidcCallbackView from '@/views/oidc/OidcCallbackView.vue';

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

const testEntrypoint = '/custom-route';

// Mount

async function mountOidcCallbackView() {
  const { wrapper } = mountComponent(OidcCallbackView, {
    stubs: { Spinner: true }
  });
  await flushPromises();

  return { wrapper };
}

beforeEach(() => {
  resetMockAuthNStore();
  resetMockRouter();
});

afterEach(() => {
  sessionStorage.clear();
});

// Tests

describe('OidcCallbackView', () => {
  describe('rendering', () => {
    it('renders the authorizing message', async () => {
      const { wrapper } = await mountOidcCallbackView();

      expect(wrapper.text()).toContain('Authorizing...');
    });
  });

  describe('login callback', () => {
    it('completes the login callback', async () => {
      await mountOidcCallbackView();

      expect(mockAuthNStore.loginCallback).toHaveBeenCalledOnce();
    });

    it('removes the stored entrypoint and redirects to it', async () => {
      sessionStorage.setItem(StorageKey.AUTH, testEntrypoint);

      await mountOidcCallbackView();

      expect(sessionStorage.getItem(StorageKey.AUTH)).toBeNull();
      expect(mockRouter.replace).toHaveBeenCalledWith(testEntrypoint);
    });

    it('redirects to the demo form when there is no stored entrypoint', async () => {
      await mountOidcCallbackView();

      expect(mockRouter.replace).toHaveBeenCalledWith({ name: RouteName.DEMO_FORM });
    });
  });
});
