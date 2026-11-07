import { RouterLinkStub } from '@vue/test-utils';

import { AppDrawer } from '@/components/layout';
import Header from '@/components/layout/Header.vue';
import { RouteName } from '@/utils/enums/application';

import { mountComponent } from '../../../mountComponent';

// Mocks

// `useRoute` is a vi.fn() so individual tests can set the route meta
const mockUseRoute = vi.fn(() => ({ meta: {} as Record<string, unknown> }));

vi.mock('vue-router', () => ({
  useRoute: () => mockUseRoute()
}));

// Fixtures

// Mount

function mountHeader() {
  const { wrapper } = mountComponent(Header, {
    stubs: { AppDrawer: true, HeaderMenu: true }
  });

  return { wrapper };
}

beforeEach(() => {
  mockUseRoute.mockReset();
  mockUseRoute.mockReturnValue({ meta: {} });
});

// Tests

describe('Header', () => {
  describe('rendering', () => {
    it('links the logo to gov.bc.ca', () => {
      const { wrapper } = mountHeader();

      expect(wrapper.find('img').element.parentElement?.getAttribute('href')).toBe('https://www2.gov.bc.ca');
    });

    it('links the app name to the home page', () => {
      const { wrapper } = mountHeader();
      const link = wrapper.findComponent(RouterLinkStub);

      expect(link.text()).toBe('Vue 3 Scaffold');
      expect(link.props('to')).toEqual({ name: RouteName.HOME });
    });

    it('shows the app drawer by default', () => {
      const { wrapper } = mountHeader();

      expect(wrapper.findComponent(AppDrawer).exists()).toBe(true);
    });

    it('hides the app drawer when the route asks to', () => {
      mockUseRoute.mockReturnValue({ meta: { hideAppDrawer: true } });

      const { wrapper } = mountHeader();

      expect(wrapper.findComponent(AppDrawer).exists()).toBe(false);
    });
  });
});
