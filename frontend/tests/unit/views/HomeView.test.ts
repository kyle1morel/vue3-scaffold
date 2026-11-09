import { RouterLinkStub } from '@vue/test-utils';

import { RouteName } from '@/utils/enums';
import HomeView from '@/views/HomeView.vue';

import { expectNoAxeViolations } from '../../expectNoAxeViolations';
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

    it('links to each demo page when logged in', () => {
      mockAuthNStore.getIsAuthenticated.value = true;

      const { wrapper } = mountHomeView();

      expect(wrapper.find('button').exists()).toBe(false);
      expect(wrapper.findAllComponents(RouterLinkStub).map((link) => link.props('to'))).toEqual([
        { name: RouteName.DEMO_FORM },
        { name: RouteName.SUBMISSIONS },
        { name: RouteName.COMPONENTS },
        { name: RouteName.DEVELOPER }
      ]);
    });
  });

  describe('accessibility', () => {
    it('has no axe violations', async () => {
      const { wrapper } = mountHomeView();

      await expectNoAxeViolations(wrapper.element);
    });
  });
});
