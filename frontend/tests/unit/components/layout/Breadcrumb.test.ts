import { enableAutoUnmount, RouterLinkStub } from '@vue/test-utils';
import { defineComponent, h } from 'vue';

import Breadcrumb from '@/components/layout/Breadcrumb.vue';
import { useBreadcrumb } from '@/composables/useBreadcrumb';

import { mountComponent } from '../../../mountComponent';

// Mocks

// `useRoute` is a vi.fn() so each test can set the matched route records
const mockUseRoute = vi.fn();

vi.mock('vue-router', () => ({
  useRoute: () => mockUseRoute()
}));

// Fixtures

// A nameless parent whose empty-path child is its page, and a named child page under it
const testParent = {
  path: '/submissions',
  meta: { breadcrumb: () => 'Submissions' },
  children: [{ path: '', name: 'submissions' }]
};
const testChild = {
  path: '/submissions/:id',
  name: 'submission',
  meta: { breadcrumb: () => 'Submission' },
  children: []
};

function testRoute(matched: unknown[], meta = {}) {
  return { matched, meta };
}

// Mount

function mountBreadcrumb(pageLabel?: string | null) {
  // A view naming its own crumb, as DemoFormView does
  const View = defineComponent(() => {
    if (pageLabel !== undefined) useBreadcrumb(pageLabel);
    return () => h(Breadcrumb);
  });
  const { wrapper } = mountComponent(View);

  return { wrapper, links: () => wrapper.findAllComponents(RouterLinkStub) };
}

beforeEach(() => {
  mockUseRoute.mockReset();
});

// The view's label is shared state, cleared when the view unmounts.
enableAutoUnmount(afterEach);

// Tests

describe('Breadcrumb', () => {
  describe('rendering', () => {
    it('renders nothing with fewer than two crumbs', () => {
      mockUseRoute.mockReturnValue(testRoute([testParent, { path: '/submissions', meta: {} }]));

      const { wrapper } = mountBreadcrumb();

      expect(wrapper.find('nav').exists()).toBe(false);
    });

    it('renders nothing when the route hides the breadcrumb', () => {
      mockUseRoute.mockReturnValue(testRoute([testParent, testChild], { hideBreadcrumb: true }));

      const { wrapper } = mountBreadcrumb();

      expect(wrapper.find('nav').exists()).toBe(false);
    });

    it('links the parent through its empty-path child and marks the current page', () => {
      mockUseRoute.mockReturnValue(testRoute([testParent, testChild]));

      const { wrapper, links } = mountBreadcrumb();

      expect(wrapper.find('nav').attributes('aria-label')).toBe('Breadcrumb');
      expect(links().map((link) => [link.text(), link.props('to')])).toEqual([
        ['Submissions', { name: 'submissions' }]
      ]);
      expect(wrapper.find('[aria-current="page"]').text()).toBe('Submission');
    });

    it('shows the label the view gives its own crumb', () => {
      mockUseRoute.mockReturnValue(testRoute([testParent, testChild]));

      const { wrapper } = mountBreadcrumb('Jane');

      expect(wrapper.find('[aria-current="page"]').text()).toBe('Jane');
    });

    it('hides the trail while the view loads its label', () => {
      mockUseRoute.mockReturnValue(testRoute([testParent, testChild]));

      const { wrapper } = mountBreadcrumb(null);

      expect(wrapper.find('nav').exists()).toBe(false);
    });

    it('marks no crumb as current when the page has no crumb of its own', () => {
      const confirmation = { path: '/submissions/:id/confirmation', name: 'confirmation', meta: {} };
      mockUseRoute.mockReturnValue(testRoute([testParent, testChild, confirmation]));

      const { wrapper, links } = mountBreadcrumb();

      expect(links().map((link) => link.text())).toEqual(['Submissions', 'Submission']);
      expect(wrapper.find('[aria-current]').exists()).toBe(false);
    });
  });
});
