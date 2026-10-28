import { RouteName } from '@/utils/enums/application';
import HomeView from '@/views/HomeView.vue';

import { mockAuthNStore, resetMockAuthNStore } from '../../mockAuthNStore';
import { mockRouter, resetMockRouter } from '../../mockRouter';
import { mountComponent } from '../../mountComponent';

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

function mountHomeView() {
  const { wrapper } = mountComponent(HomeView);

  return { wrapper };
}

beforeEach(() => {
  resetMockAuthNStore();
  resetMockRouter();
});

// Tests

describe('HomeView', () => {
  describe('user interaction', () => {
    it('goes to the login page when logged out', async () => {
      const { wrapper } = mountHomeView();
      const button = wrapper.find('button');

      expect(button.text()).toBe('Log in');
      await button.trigger('click');

      expect(mockRouter.push).toHaveBeenCalledWith({ name: RouteName.OIDC_LOGIN });
    });

    it('goes to the demo form when logged in', async () => {
      mockAuthNStore.getIsAuthenticated.value = true;

      const { wrapper } = mountHomeView();
      const button = wrapper.find('button');

      expect(button.text()).toBe('Demo form');
      await button.trigger('click');

      expect(mockRouter.push).toHaveBeenCalledWith({ name: RouteName.DEMO_FORM });
    });
  });
});
