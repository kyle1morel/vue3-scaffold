import { enableAutoUnmount, flushPromises } from '@vue/test-utils';

import AppDrawer from '@/components/layout/AppDrawer.vue';

import { mockAuthNStore, resetMockAuthNStore } from '../../../mockAuthNStore';
import { mountComponent } from '../../../mountComponent';

// Mocks

vi.mock('@/store/authnStore', () => ({
  default: () => mockAuthNStore,
  useAuthNStore: () => mockAuthNStore
}));

// Fixtures

interface DrawerItem {
  label: string;
  items?: DrawerItem[];
}

// Mount

function mountAppDrawer() {
  const { wrapper } = mountComponent(AppDrawer);
  // permittedItems and visible are script-setup state with no rendered equivalent until the drawer opens
  const vm = wrapper.vm as unknown as { permittedItems: DrawerItem[]; visible: boolean };

  return { wrapper, vm };
}

beforeEach(() => {
  resetMockAuthNStore();
});

// An open drawer teleports to the body and outlives its test, re-rendering when a later test changes the auth mock
enableAutoUnmount(afterEach);

// Tests

describe('AppDrawer', () => {
  describe('rendering', () => {
    it('renders the menu button', () => {
      const { wrapper } = mountAppDrawer();

      expect(wrapper.find('button').text()).toContain('Menu');
    });

    it('shows only public items when logged out', () => {
      const { vm } = mountAppDrawer();

      expect(vm.permittedItems.map((item) => item.label)).toEqual(['Home']);
    });

    it('shows every item when logged in', () => {
      mockAuthNStore.getIsAuthenticated.value = true;

      const { vm } = mountAppDrawer();

      expect(vm.permittedItems.map((item) => item.label)).toEqual(['Home', 'Demo', 'Developer']);
    });

    it('nests the demo form and submissions under Demo', () => {
      mockAuthNStore.getIsAuthenticated.value = true;

      const { vm } = mountAppDrawer();
      const demo = vm.permittedItems.find((item) => item.label === 'Demo');

      expect(demo?.items?.map((item) => item.label)).toEqual(['Demo form', 'Submissions']);
    });
  });

  describe('user interaction', () => {
    it('opens the drawer when the menu button is clicked', async () => {
      const { wrapper, vm } = mountAppDrawer();

      await wrapper.find('button').trigger('click');
      await flushPromises();

      expect(vm.visible).toBe(true);
    });

    it('lists the nested items once the drawer is open', async () => {
      mockAuthNStore.getIsAuthenticated.value = true;
      const { wrapper } = mountAppDrawer();

      await wrapper.find('button').trigger('click');
      await flushPromises();

      // The drawer teleports to the body, outside the wrapper
      const nested = [...document.body.querySelectorAll('ul ul li')].map((li) => li.textContent?.trim());
      expect(nested).toEqual(['Demo form', 'Submissions']);
    });
  });
});
