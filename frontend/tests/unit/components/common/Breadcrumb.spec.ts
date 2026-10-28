import { RouterLinkStub } from '@vue/test-utils';

import Breadcrumb from '@/components/common/Breadcrumb.vue';
import { RouteName } from '@/utils/enums/application';

import { mountComponent } from '../../../mountComponent';

import type { MenuItem } from 'primevue/menuitem';

// Mocks

// `useRoute` is a vi.fn() so each test can set the matched route records
const mockUseRoute = vi.fn();

vi.mock('vue-router', () => ({
  useRoute: () => mockUseRoute()
}));

// Fixtures

const testStaticRoute = {
  meta: { hideBreadcrumb: false },
  matched: [
    { meta: { breadcrumb: 'Static One' }, name: 'one', path: '/one' },
    { meta: { breadcrumb: 'Static Two' }, name: 'two', path: '/two' }
  ]
};

// Builds a route whose first crumb has no name, so its link target comes from its children
function testNamelessRoute(children: unknown[]) {
  return {
    meta: { hideBreadcrumb: false },
    matched: [
      { meta: { breadcrumb: 'Parent' }, name: undefined, children, path: '/parent' },
      { meta: { breadcrumb: 'Last' }, name: 'last', path: '/last' }
    ]
  };
}

// Mount

function mountBreadcrumb() {
  const { wrapper } = mountComponent(Breadcrumb);
  // breadcrumbItems is script-setup state; the link targets aren't otherwise observable through the stub
  const vm = wrapper.vm as unknown as { breadcrumbItems: MenuItem[] };

  return { wrapper, vm };
}

beforeEach(() => {
  mockUseRoute.mockReset();
});

// Tests

describe('Breadcrumb', () => {
  describe('rendering', () => {
    it('renders nothing with fewer than two crumbs', () => {
      mockUseRoute.mockReturnValue({
        meta: { hideBreadcrumb: false },
        matched: [{ meta: { breadcrumb: 'One' }, name: 'one', path: '/one' }]
      });

      const { wrapper } = mountBreadcrumb();

      expect(wrapper.find('.p-breadcrumb').exists()).toBe(false);
    });

    it('links earlier crumbs and shows the current page as text', () => {
      mockUseRoute.mockReturnValue(testStaticRoute);

      const { wrapper } = mountBreadcrumb();
      const links = wrapper.findAllComponents(RouterLinkStub);

      expect(links.map((link) => link.text())).toEqual(['Static One']);
      expect(wrapper.text()).toContain('Static Two');
    });

    it('renders nothing when the route hides the breadcrumb', () => {
      mockUseRoute.mockReturnValue({ ...testStaticRoute, meta: { hideBreadcrumb: true } });

      const { vm } = mountBreadcrumb();

      expect(vm.breadcrumbItems).toEqual([]);
    });
  });

  describe('link targets', () => {
    it('links a nameless crumb to its first named descendant', () => {
      mockUseRoute.mockReturnValue(testNamelessRoute([{ name: undefined, children: [{ name: 'childRouteName' }] }]));

      const { vm } = mountBreadcrumb();

      expect(vm.breadcrumbItems[0]?.to).toMatchObject({ name: 'childRouteName' });
    });

    it('links a nameless crumb to the home page when no descendant has a name', () => {
      mockUseRoute.mockReturnValue(testNamelessRoute([{}]));

      const { vm } = mountBreadcrumb();

      expect(vm.breadcrumbItems[0]?.to).toMatchObject({ name: RouteName.HOME });
    });
  });
});
