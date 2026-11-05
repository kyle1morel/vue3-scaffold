import { enableAutoUnmount } from '@vue/test-utils';
import { defineComponent, h, ref } from 'vue';

import { useFormNavigationGuard } from '@/composables/useFormNavigationGuard';

import { mountComponent } from '../../mountComponent';

import type { ConfirmationOptions } from 'primevue/confirmationoptions';

// Mocks

const hoisted = vi.hoisted(() => ({
  confirmRequire: vi.fn(),
  onBeforeRouteLeave: vi.fn(),
  onBeforeRouteUpdate: vi.fn()
}));

vi.mock('primevue/useconfirm', () => ({
  useConfirm: () => ({ require: hoisted.confirmRequire })
}));

vi.mock('vue-router', () => ({
  onBeforeRouteLeave: hoisted.onBeforeRouteLeave,
  onBeforeRouteUpdate: hoisted.onBeforeRouteUpdate
}));

// Fixtures

// Mount

function mountGuard(options: { dirty?: boolean } = {}) {
  const isDirty = ref(options.dirty ?? false);
  const { wrapper } = mountComponent(
    defineComponent({
      setup: () => useFormNavigationGuard(isDirty),
      render: () => h('div')
    })
  );

  const guard: () => boolean | Promise<boolean> = hoisted.onBeforeRouteLeave.mock.lastCall![0];
  const confirmation = (): ConfirmationOptions => hoisted.confirmRequire.mock.lastCall![0];

  return { wrapper, isDirty, guard, confirmation };
}

function closeTab() {
  const event = new Event('beforeunload', { cancelable: true });
  window.dispatchEvent(event);

  return event.defaultPrevented;
}

enableAutoUnmount(afterEach);

beforeEach(() => {
  vi.clearAllMocks();
});

// Tests

describe('useFormNavigationGuard', () => {
  describe('route navigation', () => {
    it('leaves a clean form without asking', async () => {
      const { guard } = mountGuard();

      expect(await guard()).toBe(true);
      expect(hoisted.confirmRequire).not.toHaveBeenCalled();
    });

    it('leaves a dirty form when the user accepts', async () => {
      const { confirmation, guard } = mountGuard({ dirty: true });

      const result = guard();
      confirmation().accept!();

      expect(await result).toBe(true);
    });

    it('stays on a dirty form when the user rejects', async () => {
      const { confirmation, guard } = mountGuard({ dirty: true });

      const result = guard();
      confirmation().reject!();

      expect(await result).toBe(false);
    });

    it('stays when the dialog is dismissed, and asks again next time', async () => {
      const { confirmation, guard } = mountGuard({ dirty: true });

      const first = guard();
      confirmation().onHide!();
      expect(await first).toBe(false);

      const second = guard();
      confirmation().accept!();
      expect(await second).toBe(true);
      expect(hoisted.confirmRequire).toHaveBeenCalledTimes(2);
    });
  });

  describe('changes within the same route', () => {
    function updateGuard() {
      const update: (to: { fullPath: string }, from: { fullPath: string }) => boolean | Promise<boolean> =
        hoisted.onBeforeRouteUpdate.mock.lastCall![0];

      return update;
    }

    it('asks before a param change', () => {
      mountGuard({ dirty: true });

      updateGuard()({ fullPath: '/submissions/2' }, { fullPath: '/submissions/1' });

      expect(hoisted.confirmRequire).toHaveBeenCalledOnce();
    });

    it('asks before a query change', () => {
      mountGuard({ dirty: true });

      updateGuard()({ fullPath: '/demo-form?step=2' }, { fullPath: '/demo-form' });

      expect(hoisted.confirmRequire).toHaveBeenCalledOnce();
    });

    it('lets a hash-only change through without asking', () => {
      mountGuard({ dirty: true });

      const result = updateGuard()({ fullPath: '/demo-form#notes' }, { fullPath: '/demo-form' });

      expect(result).toBe(true);
      expect(hoisted.confirmRequire).not.toHaveBeenCalled();
    });
  });

  describe('closing the tab', () => {
    it('asks only while the form is dirty', () => {
      const { isDirty } = mountGuard();
      expect(closeTab()).toBe(false);

      isDirty.value = true;

      expect(closeTab()).toBe(true);
    });

    it('stops asking once unmounted', () => {
      const { wrapper } = mountGuard({ dirty: true });

      wrapper.unmount();

      expect(closeTab()).toBe(false);
    });
  });
});
