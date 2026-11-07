import { Menu } from '@/components/bcds';
import HeaderMenu from '@/components/layout/HeaderMenu.vue';
import { RouteName } from '@/utils/enums';

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

const testProfile = {
  sub: 'test-sub',
  iss: 'test-issuer',
  aud: 'test-audience',
  exp: 0,
  iat: 0,
  name: 'Jane Doe',
  display_name: 'jdoe'
};

// Mount

function mountHeaderMenu() {
  const { wrapper } = mountComponent(HeaderMenu);

  return { wrapper };
}

beforeEach(() => {
  resetMockAuthNStore();
  resetMockRouter();
  vi.clearAllMocks();
});

// Tests

describe('HeaderMenu', () => {
  describe('rendering', () => {
    it('renders nothing when the user is not authenticated', () => {
      const { wrapper } = mountHeaderMenu();

      expect(wrapper.find('button').exists()).toBe(false);
    });

    it('shows the profile name when authenticated', () => {
      mockAuthNStore.getIsAuthenticated.value = true;
      mockAuthNStore.getProfile.value = testProfile;

      const { wrapper } = mountHeaderMenu();

      expect(wrapper.find('button').text()).toContain(testProfile.name);
    });

    it('falls back to display_name when name is missing', () => {
      mockAuthNStore.getIsAuthenticated.value = true;
      mockAuthNStore.getProfile.value = { ...testProfile, name: undefined };

      const { wrapper } = mountHeaderMenu();

      expect(wrapper.find('button').text()).toContain(testProfile.display_name);
    });
  });

  describe('user interaction', () => {
    it('navigates to the logout route', () => {
      mockAuthNStore.getIsAuthenticated.value = true;
      mockAuthNStore.getProfile.value = testProfile;

      const { wrapper } = mountHeaderMenu();

      const items = wrapper.findComponent(Menu).props('items');
      items?.[0]?.onAction?.();

      expect(mockRouter.push).toHaveBeenCalledWith({ name: RouteName.OIDC_LOGOUT });
    });
  });
});
