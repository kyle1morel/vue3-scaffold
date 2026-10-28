import { flushPromises } from '@vue/test-utils';

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
  mailTo?: string;
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

// Tests

describe('AppDrawer', () => {
  describe('rendering', () => {
    it('renders the menu button', () => {
      const { wrapper } = mountAppDrawer();

      expect(wrapper.find('button').text()).toContain('Menu');
    });

    it('shows only public items when logged out', () => {
      const { vm } = mountAppDrawer();

      expect(vm.permittedItems.map((item) => item.label)).toEqual(['Home', 'Help']);
    });

    it('shows every item when logged in', () => {
      mockAuthNStore.getIsAuthenticated.value = true;

      const { vm } = mountAppDrawer();

      expect(vm.permittedItems.map((item) => item.label)).toEqual([
        'Home',
        'Demo form',
        'Submissions',
        'Developer',
        'Help'
      ]);
    });

    it('links the help item to a support email', () => {
      const { vm } = mountAppDrawer();
      const help = vm.permittedItems.find((item) => item.label === 'Help');

      expect(help?.items?.find((item) => item.mailTo)?.mailTo).toContain('mailto:');
    });
  });

  describe('user interaction', () => {
    it('opens the drawer when the menu button is clicked', async () => {
      const { wrapper, vm } = mountAppDrawer();

      await wrapper.find('button').trigger('click');
      await flushPromises();

      expect(vm.visible).toBe(true);
    });
  });
});
