import { h } from 'vue';
import { mount } from '@vue/test-utils';

import { ToggleButton, ToggleButtonGroup } from '@/components/bcds';

// Mocks

// Fixtures

const testViews = ['day', 'week', 'month'];

// Mount

function mountGroup(props: Record<string, unknown> = {}) {
  const wrapper = mount(ToggleButtonGroup, {
    props: { label: 'Calendar view', modelValue: 'week', ...props },
    slots: { default: () => testViews.map((view) => h(ToggleButton, { label: view, value: view })) }
  });

  return { wrapper, buttons: wrapper.findAll('button') };
}

// Tests

describe('ToggleButton', () => {
  it('turns on when clicked', async () => {
    const wrapper = mount(ToggleButton, { props: { label: 'Preview', modelValue: false } });

    await wrapper.find('button').trigger('click');

    expect(wrapper.emitted('update:modelValue')).toEqual([[true]]);
  });
});

describe('ToggleButtonGroup', () => {
  it('names the group with its label', () => {
    const { wrapper } = mountGroup();
    const group = wrapper.find('[role="group"]');

    expect(wrapper.find(`[id="${group.attributes('aria-labelledby')}"]`).text()).toBe('Calendar view');
  });

  it('shows the selected button as pressed', () => {
    const { buttons } = mountGroup();

    expect(buttons.map((button) => button.attributes('aria-pressed'))).toEqual(['false', 'true', 'false']);
  });

  it('selects the clicked button', async () => {
    const { wrapper, buttons } = mountGroup();

    await buttons[2]!.trigger('click');

    expect(wrapper.emitted('update:modelValue')).toEqual([['month']]);
  });

  it('keeps the last selection when empty selection is disallowed', async () => {
    const { wrapper, buttons } = mountGroup({ disallowEmptySelection: true });

    await buttons[1]!.trigger('click');

    expect(wrapper.emitted('update:modelValue')).toBeUndefined();
  });
});
