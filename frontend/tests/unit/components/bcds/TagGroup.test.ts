import { h } from 'vue';
import { mount } from '@vue/test-utils';

import { TagGroup, TagList } from '@/components/bcds';
import i18n from '@/i18n';

// Mocks

// Fixtures

const testTags = [
  { id: 'blue', label: 'Blue' },
  { id: 'gold', label: 'Gold' }
];

// Mount

function mountTagGroup(props: Record<string, unknown> = {}, items = testTags) {
  return mount(TagGroup, {
    props: { label: 'Chosen tags', ...props },
    slots: { default: () => h(TagList, { items }, { empty: () => 'No tags' }) },
    global: { plugins: [i18n] }
  });
}

// Tests

describe('TagGroup', () => {
  it('names the tags with its label', () => {
    const wrapper = mountTagGroup();
    const group = wrapper.find('[role="group"]');

    expect(wrapper.find(`[id="${group.attributes('aria-labelledby')}"]`).text()).toBe('Chosen tags');
    expect(group.findAll('li').map((tag) => tag.text())).toEqual(['Blue', 'Gold']);
  });

  it('removes a tag from its button', async () => {
    const wrapper = mountTagGroup({ removable: true });

    await wrapper.find('button[aria-label="Remove Gold"]').trigger('click');

    expect(wrapper.emitted('remove')).toEqual([['gold']]);
  });

  it('has no remove buttons unless removable', () => {
    const wrapper = mountTagGroup();

    expect(wrapper.find('button').exists()).toBe(false);
  });

  it('shows the empty content without tags', () => {
    const wrapper = mountTagGroup({}, []);

    expect(wrapper.find('[role="group"]').text()).toBe('No tags');
  });
});
