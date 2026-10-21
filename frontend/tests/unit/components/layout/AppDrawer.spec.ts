import { createTestingPinia } from '@pinia/testing';
import PrimeVue from 'primevue/config';
import { flushPromises, mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import AppDrawer from '@/components/layout/AppDrawer.vue';
import { useAuthNStore } from '@/store';
import { StorageKey } from '@/utils/enums/application';

interface DrawerItem {
  label: string;
  public?: boolean;
  items?: DrawerItem[];
  mailTo?: string;
}

const mockPush = vi.fn();
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: mockPush
  })
}));

beforeEach(() => {
  sessionStorage.setItem(
    StorageKey.CONFIG,
    JSON.stringify({
      oidc: {
        authority: 'abc',
        clientId: '123'
      }
    })
  );

  vi.clearAllMocks();
});

afterEach(() => {
  sessionStorage.clear();
});

describe('AppDrawer.vue', () => {
  const createMountOptions = () => ({
    global: {
      plugins: [
        PrimeVue,
        createTestingPinia({
          stubActions: false
        })
      ],
      stubs: {
        'font-awesome-icon': true,
        RouterLink: true
      }
    }
  });

  const mountOptions = createMountOptions();

  it('renders menu button', () => {
    const wrapper = mount(AppDrawer, mountOptions);

    expect(wrapper.find('button').exists()).toBe(true);
    expect(wrapper.text()).toContain('Menu');
  });

  it('opens drawer when menu button is clicked', async () => {
    const wrapper = mount(AppDrawer, mountOptions);

    await wrapper.find('button').trigger('click');
    await flushPromises();

    expect((wrapper.vm as any).visible).toBe(true); // eslint-disable-line @typescript-eslint/no-explicit-any
  });

  it('shows only public items when unauthenticated', async () => {
    const wrapper = mount(AppDrawer, createMountOptions());

    await flushPromises();

    const permittedItems = (wrapper.vm as any).permittedItems; // eslint-disable-line @typescript-eslint/no-explicit-any
    expect(permittedItems.map((item: DrawerItem) => item.label)).toEqual(['Home', 'Help']);
  });

  it('shows the developer item when authenticated', async () => {
    const wrapper = mount(AppDrawer, createMountOptions());
    useAuthNStore().isAuthenticated = true;

    await flushPromises();

    const permittedItems = (wrapper.vm as any).permittedItems; // eslint-disable-line @typescript-eslint/no-explicit-any
    expect(permittedItems.map((item: DrawerItem) => item.label)).toEqual(['Home', 'Developer', 'Help']);
  });

  it('has mailto links in help menu', async () => {
    const wrapper = mount(AppDrawer, mountOptions);

    await flushPromises();

    const permittedItems = (wrapper.vm as any).permittedItems; // eslint-disable-line @typescript-eslint/no-explicit-any
    const helpItem = permittedItems.find((item: DrawerItem) => item.label === 'Help');
    const mailToItem = helpItem?.items?.find((item: DrawerItem) => item.mailTo);
    expect(mailToItem?.mailTo).toContain('mailto:');
  });
});
