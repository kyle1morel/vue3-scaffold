import { flushPromises } from '@vue/test-utils';
import { AxiosError } from 'axios';

import { getCurrentUser } from '@/services/userService';
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

vi.mock('@/services/userService', () => ({
  getCurrentUser: vi.fn()
}));

vi.mock('vue-router', () => ({
  useRouter: () => mockRouter
}));

// Fixtures

const testEntrypoint = '/custom-route';

function testAxiosError(status: number) {
  return new AxiosError('Request failed', undefined, undefined, undefined, { status } as never);
}

// Mount

async function mountOidcCallbackView() {
  const { wrapper } = mountComponent(OidcCallbackView, {
    stubs: { Spinner: true }
  });
  await flushPromises();

  return { wrapper };
}

beforeEach(() => {
  vi.clearAllMocks();
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

    it('gets the current user so the API records the login', async () => {
      await mountOidcCallbackView();

      expect(getCurrentUser).toHaveBeenCalledOnce();
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

  describe('login failure', () => {
    it('removes the user and shows the deactivated message when the API forbids them', async () => {
      vi.mocked(getCurrentUser).mockRejectedValueOnce(testAxiosError(403));

      const { wrapper } = await mountOidcCallbackView();

      expect(mockAuthNStore.removeUser).toHaveBeenCalledOnce();
      expect(wrapper.text()).toContain('Your account is deactivated.');
      expect(wrapper.text()).not.toContain('Authorizing...');
      expect(mockRouter.replace).not.toHaveBeenCalled();
    });

    it('removes the user and shows the failed message when the API request fails', async () => {
      vi.mocked(getCurrentUser).mockRejectedValueOnce(testAxiosError(500));

      const { wrapper } = await mountOidcCallbackView();

      expect(mockAuthNStore.removeUser).toHaveBeenCalledOnce();
      expect(wrapper.text()).toContain('log you in. Please try again.');
      expect(mockRouter.replace).not.toHaveBeenCalled();
    });

    it('skips the API and shows the failed message when the login callback fails', async () => {
      mockAuthNStore.loginCallback.mockRejectedValueOnce(new Error('state mismatch'));

      const { wrapper } = await mountOidcCallbackView();

      expect(getCurrentUser).not.toHaveBeenCalled();
      expect(mockAuthNStore.removeUser).toHaveBeenCalledOnce();
      expect(wrapper.text()).toContain('log you in. Please try again.');
    });

    it('keeps the stored entrypoint for the next login attempt', async () => {
      sessionStorage.setItem(StorageKey.AUTH, testEntrypoint);
      vi.mocked(getCurrentUser).mockRejectedValueOnce(testAxiosError(500));

      await mountOidcCallbackView();

      expect(sessionStorage.getItem(StorageKey.AUTH)).toBe(testEntrypoint);
    });

    it('goes to the login page when log in is clicked', async () => {
      vi.mocked(getCurrentUser).mockRejectedValueOnce(testAxiosError(500));

      const { wrapper } = await mountOidcCallbackView();
      await wrapper.find('button').trigger('click');

      expect(mockRouter.replace).toHaveBeenCalledWith({ name: RouteName.LOGIN });
    });
  });
});
