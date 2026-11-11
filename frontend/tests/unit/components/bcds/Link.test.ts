import { h } from 'vue';
import { mount, RouterLinkStub } from '@vue/test-utils';

import { Link, Subheader } from '@/components/bcds';

// Mocks

// Fixtures

// Mount

function mountLink(props: Record<string, unknown> = {}) {
  return mount(Link, {
    props,
    slots: { default: () => 'Home' },
    global: { stubs: { RouterLink: RouterLinkStub } }
  });
}

// Tests

describe('Link', () => {
  it('links to an address', () => {
    const wrapper = mountLink({ href: 'https://www2.gov.bc.ca' });

    expect(wrapper.find('a').attributes('href')).toBe('https://www2.gov.bc.ca');
  });

  it('links to a page in the app through the router', () => {
    const wrapper = mountLink({ to: { name: 'home' } });

    expect(wrapper.findComponent(RouterLinkStub).props('to')).toEqual({ name: 'home' });
  });

  it('has no destination when disabled', () => {
    const link = mountLink({ disabled: true, href: 'https://www2.gov.bc.ca' }).find('a');

    expect(link.attributes('href')).toBeUndefined();
    expect(link.attributes('aria-disabled')).toBe('true');
  });
});

describe('Subheader', () => {
  it('lists each item in a named nav, with a separator between them', () => {
    const wrapper = mount(Subheader, {
      attrs: { 'aria-label': 'Demo pages' },
      slots: { default: () => ['One', 'Two', 'Three'].map((text) => h('a', { href: '#' }, text)) }
    });

    expect(wrapper.find('nav').attributes('aria-label')).toBe('Demo pages');
    expect(wrapper.findAll('.bcds-subheader-item').map((item) => item.text())).toEqual(['One', 'Two', 'Three']);
    expect(wrapper.findAll('.bcds-subheader-separator')).toHaveLength(2);
  });
});
