import { createTestingPinia } from '@pinia/testing';
import { mount } from '@vue/test-utils';
import PrimeVue from 'primevue/config';

import Breadcrumb from '@/components/common/Breadcrumb.vue';
import { RouteName } from '@/utils/enums/application';

let mockRoute = {};

vi.mock('vue-router', () => ({
  useRoute: () => mockRoute,
  useRouter: () => ({
    push: vi.fn()
  })
}));

describe('Breadcrumb.vue', () => {
  const mountComponent = () => {
    return mount(Breadcrumb, {
      global: {
        plugins: [
          createTestingPinia({
            stubActions: false,
            initialState: {}
          }),
          PrimeVue
        ],
        stubs: {
          'router-link': {
            template: '<a :to="to"><slot /></a>',
            props: ['to']
          }
        }
      }
    });
  };

  beforeEach(() => {
    mockRoute = {};
  });

  test('does not render breadcrumb if less than 2 matched records', () => {
    mockRoute = {
      meta: { hideBreadcrumb: false },
      matched: [{ meta: { breadcrumb: 'one' }, name: 'one', path: '/one' }]
    };

    const wrapper = mountComponent();

    expect(
      wrapper
        .html()
        .replace(/<!--.*?-->/g, '')
        .trim()
    ).toBe('');
  });

  test('renders static breadcrumbs correctly', () => {
    mockRoute = {
      meta: { hideBreadcrumb: false },
      matched: [
        { meta: { breadcrumb: 'Static One' }, name: 'one', path: '/one' },
        { meta: { breadcrumb: 'Static Two' }, name: 'two', path: '/two' }
      ]
    };

    const wrapper = mountComponent();
    const breadcrumb = wrapper.findComponent({ name: 'Breadcrumb' });
    const links = breadcrumb.findAll('a');
    const allSpans = breadcrumb.findAll('span');
    const currentSpans = allSpans.filter((span) => !span.element.closest('a'));

    expect(links.length).toBe(1);
    expect(currentSpans.length).toBeGreaterThanOrEqual(1);
    expect(links[0]!.text()).toBe('Static One');
    expect(currentSpans[0]!.text()).toBe('Static Two');
  });

  test('getRouteNameFromFirstChild returns child name through recursion', () => {
    mockRoute = {
      meta: { hideBreadcrumb: false },
      matched: [
        {
          meta: { breadcrumb: 'Test' },
          name: undefined,
          children: [
            {
              name: undefined,
              children: [{ name: 'childRouteName' }]
            }
          ],
          path: '/test'
        },
        { meta: { breadcrumb: 'Last' }, name: 'last', path: '/last' }
      ]
    };

    const wrapper = mountComponent();
    const toObj = (wrapper.vm as any).breadcrumbItems[0].to; // eslint-disable-line @typescript-eslint/no-explicit-any
    expect(toObj.name).toBe('childRouteName');
  });

  test('getRouteNameFromFirstChild returns RouteName.HOME when no child name found', () => {
    mockRoute = {
      meta: { hideBreadcrumb: false },
      matched: [
        {
          meta: { breadcrumb: 'Test' },
          name: undefined,
          children: [{}],
          path: '/test'
        },
        { meta: { breadcrumb: 'Last' }, name: 'last', path: '/last' }
      ]
    };

    const wrapper = mountComponent();
    const toObj = (wrapper.vm as any).breadcrumbItems[0].to; // eslint-disable-line @typescript-eslint/no-explicit-any
    expect(toObj.name).toBe(RouteName.HOME);
  });

  test('returns empty breadcrumb array when route.meta.hideBreadcrumb is true', () => {
    mockRoute = {
      meta: { hideBreadcrumb: true },
      matched: [{ meta: { breadcrumb: 'Should not appear' }, name: 'test', path: '/test' }]
    };

    const wrapper = mountComponent();
    expect((wrapper.vm as any).breadcrumbItems).toEqual([]); // eslint-disable-line @typescript-eslint/no-explicit-any
  });
});
