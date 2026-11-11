import { h } from 'vue';
import { mount } from '@vue/test-utils';

import { Callout } from '@/components/bcds';

// Mocks

// Fixtures

// Mount

function mountCallout(props: Record<string, unknown> = {}, slots: Record<string, () => unknown> = {}) {
  return mount(Callout, {
    props: { description: 'Have your details ready.', title: 'Before you start', ...props },
    slots
  });
}

// Tests

describe('Callout', () => {
  it('is a note named by its title', () => {
    const wrapper = mountCallout();

    expect(wrapper.attributes('role')).toBe('note');
    expect(wrapper.find(`[id="${wrapper.attributes('aria-labelledby')}"]`).text()).toBe('Before you start');
  });

  it('gives each title its own id', () => {
    const wrapper = mount({ render: () => [h(Callout, { title: 'First' }), h(Callout, { title: 'Second' })] });
    const [first, second] = wrapper.findAll('[role="note"]');

    expect(first!.attributes('aria-labelledby')).not.toBe(second!.attributes('aria-labelledby'));
  });

  it('groups its buttons', () => {
    const wrapper = mountCallout({}, { buttons: () => h('button', 'Start') });

    expect(wrapper.find('[role="group"]').text()).toBe('Start');
  });

  it('shows its own content in place of the title and description', () => {
    const wrapper = mountCallout({}, { default: () => 'Custom content' });

    expect(wrapper.text()).toBe('Custom content');
    expect(wrapper.attributes('aria-labelledby')).toBeUndefined();
  });
});
