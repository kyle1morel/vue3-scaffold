import { RouterLinkStub } from '@vue/test-utils';

import { AppDrawer, AppLayout } from '@/components/layout';
import { RouteName } from '@/utils/enums';

import { mountComponent } from '../../../mountComponent';

// Mocks

// `useRoute` is a vi.fn() so individual tests can set the route meta.
const mockUseRoute = vi.fn(() => ({ meta: {} as Record<string, unknown> }));

vi.mock('vue-router', () => ({
  useRoute: () => mockUseRoute()
}));

// Fixtures

// Mount

function mountLayout() {
  const { wrapper } = mountComponent(AppLayout, {
    stubs: { AppDrawer: true, Footer: true, HeaderMenu: true }
  });

  return { wrapper };
}

beforeEach(() => {
  mockUseRoute.mockReset();
  mockUseRoute.mockReturnValue({ meta: {} });
});

// Tests

describe('AppLayout', () => {
  describe('header', () => {
    it('links the logo to the home page', () => {
      const { wrapper } = mountLayout();
      const link = wrapper.findComponent(RouterLinkStub);

      expect(link.find('img').exists()).toBe(true);
      expect(link.props('to')).toEqual({ name: RouteName.HOME });
    });

    it('shows the app name as the title', () => {
      const { wrapper } = mountLayout();

      expect(wrapper.find('.bcds-header-title').text()).toBe('Vue 3 Scaffold');
    });

    it('moves focus to the main content from the skip link', async () => {
      // The layout's own main isn't in the document, so focus can't land on it
      const main = document.createElement('main');
      main.id = 'main-content';
      main.tabIndex = -1;
      document.body.append(main);
      const { wrapper } = mountLayout();

      await wrapper.find('a[href="#main-content"]').trigger('click');

      expect(document.activeElement).toBe(main);
      main.remove();
    });

    it('shows the app drawer by default', () => {
      const { wrapper } = mountLayout();

      expect(wrapper.findComponent(AppDrawer).exists()).toBe(true);
    });

    it('hides the app drawer when the route asks to', () => {
      mockUseRoute.mockReturnValue({ meta: { hideAppDrawer: true } });

      const { wrapper } = mountLayout();

      expect(wrapper.findComponent(AppDrawer).exists()).toBe(false);
    });
  });
});
