import { enableAutoUnmount } from '@vue/test-utils';
import { defineComponent, h, ref } from 'vue';

import { confirmRequest } from '@/composables/useConfirm';
import { useFormNavigationGuard } from '@/composables/useFormNavigationGuard';

import { mountComponent } from '../../mountComponent';

// Mocks

const hoisted = vi.hoisted(() => ({
  onBeforeRouteLeave: vi.fn(),
  onBeforeRouteUpdate: vi.fn()
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

  return { wrapper, isDirty, guard };
}

// Answers the open request, as layout/ConfirmDialog does
function answer(accepted: boolean) {
  confirmRequest.value!.resolve(accepted);
  confirmRequest.value = undefined;
}

function closeTab() {
  const event = new Event('beforeunload', { cancelable: true });
  window.dispatchEvent(event);

  return event.defaultPrevented;
}

enableAutoUnmount(afterEach);

beforeEach(() => {
  vi.clearAllMocks();
  confirmRequest.value = undefined;
});

// Tests

describe('useFormNavigationGuard', () => {
  describe('route navigation', () => {
    it('leaves a clean form without asking', async () => {
      const { guard } = mountGuard();

      expect(await guard()).toBe(true);
      expect(confirmRequest.value).toBeUndefined();
    });

    it('leaves a dirty form when the user accepts', async () => {
      const { guard } = mountGuard({ dirty: true });

      const result = guard();
      answer(true);

      expect(await result).toBe(true);
    });

    it('stays on a dirty form when the user cancels, and asks again next time', async () => {
      const { guard } = mountGuard({ dirty: true });

      const first = guard();
      answer(false);
      expect(await first).toBe(false);

      const second = guard();
      expect(confirmRequest.value).toBeDefined();
      answer(true);
      expect(await second).toBe(true);
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

      expect(confirmRequest.value).toBeDefined();
    });

    it('asks before a query change', () => {
      mountGuard({ dirty: true });

      updateGuard()({ fullPath: '/demo-form?step=2' }, { fullPath: '/demo-form' });

      expect(confirmRequest.value).toBeDefined();
    });

    it('lets a hash-only change through without asking', () => {
      mountGuard({ dirty: true });

      const result = updateGuard()({ fullPath: '/demo-form#notes' }, { fullPath: '/demo-form' });

      expect(result).toBe(true);
      expect(confirmRequest.value).toBeUndefined();
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
