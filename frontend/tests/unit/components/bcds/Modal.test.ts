import { h, nextTick } from 'vue';
import { enableAutoUnmount, mount } from '@vue/test-utils';

import { Dialog, Modal } from '@/components/bcds';
import i18n from '@/i18n';

// Mocks

// Fixtures

// Mount

async function mountModal(props: Record<string, unknown> = {}, dialogSlots: Record<string, () => unknown> = {}) {
  const wrapper = mount(Modal, {
    attachTo: document.body,
    props: { open: true, ...props },
    slots: { default: () => h(Dialog, { title: 'Edit' }, { default: () => h('p', 'Content'), ...dialogSlots }) },
    global: { plugins: [i18n] }
  });
  await nextTick();

  return { wrapper, dialog: () => document.querySelector<HTMLElement>('[role="dialog"]') };
}

enableAutoUnmount(afterEach);

// Tests

describe('Modal and Dialog', () => {
  it('names the dialog with its title', async () => {
    const { dialog } = await mountModal();

    expect(document.getElementById(dialog()!.getAttribute('aria-labelledby')!)?.textContent).toBe('Edit');
  });

  it('describes the dialog with its description', async () => {
    const { dialog } = await mountModal({}, { description: () => 'Unsaved changes will be lost.' });

    expect(document.getElementById(dialog()!.getAttribute('aria-describedby')!)?.textContent).toBe(
      'Unsaved changes will be lost.'
    );
  });

  it('has no description without one', async () => {
    const { dialog } = await mountModal();

    expect(dialog()!.hasAttribute('aria-describedby')).toBe(false);
  });

  it('closes from the close button', async () => {
    const { wrapper } = await mountModal();

    document.querySelector<HTMLButtonElement>('button[aria-label="Close"]')!.click();
    await nextTick();

    expect(wrapper.emitted('update:open')).toEqual([[false]]);
  });

  it('closes with Esc', async () => {
    const { wrapper, dialog } = await mountModal();

    dialog()!.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, cancelable: true, key: 'Escape' }));
    await nextTick();

    expect(wrapper.emitted('update:open')).toEqual([[false]]);
  });

  it('stays open on Esc when it closes only from its buttons', async () => {
    const { wrapper, dialog } = await mountModal({ closeOnEscape: false });

    dialog()!.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, cancelable: true, key: 'Escape' }));
    await nextTick();

    expect(wrapper.emitted('update:open')).toBeUndefined();
  });
});
