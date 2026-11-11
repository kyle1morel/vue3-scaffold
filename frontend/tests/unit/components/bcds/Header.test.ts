import { h } from 'vue';
import { mount } from '@vue/test-utils';

import { Header } from '@/components/bcds';
import i18n from '@/i18n';

// Mocks

// Fixtures

// Mount

function mountHeader(props: Record<string, unknown> = {}, slots: Record<string, () => unknown> = {}) {
  return { wrapper: mount(Header, { props, slots, global: { plugins: [i18n] } }) };
}

// Tests

describe('Header', () => {
  describe('title', () => {
    it('shows the title after a divider', () => {
      const { wrapper } = mountHeader({ title: 'Vue 3 Scaffold' });

      expect(wrapper.find('.bcds-header-line').exists()).toBe(true);
      expect(wrapper.find('span.bcds-header-title').text()).toBe('Vue 3 Scaffold');
    });

    it('leaves out the title and divider without a title', () => {
      const { wrapper } = mountHeader();

      expect(wrapper.find('.bcds-header-line').exists()).toBe(false);
      expect(wrapper.find('.bcds-header-title').exists()).toBe(false);
    });
  });

  describe('slots', () => {
    it('replaces the logo and its link', () => {
      const { wrapper } = mountHeader({}, { logo: () => h('a', { href: '/home' }, 'Home') });

      expect(wrapper.find('img').exists()).toBe(false);
      expect(wrapper.find('a').attributes('href')).toBe('/home');
    });

    it('puts each skip link in its own list item', () => {
      const { wrapper } = mountHeader(
        {},
        { skipLinks: () => [h('a', { href: '#main' }, 'Main'), h('a', { href: '#nav' }, 'Nav')] }
      );

      expect(wrapper.findAll('.bcds-header-skiplinks > li > a').map((link) => link.text())).toEqual(['Main', 'Nav']);
    });

    it('puts the skip links before the logo, so they are the first tab stops', () => {
      const { wrapper } = mountHeader({}, { skipLinks: () => [h('a', { href: '#main' }, 'Main')] });

      expect(wrapper.findAll('a').map((link) => link.text())).toEqual(['Main', '']);
    });

    it('renders its content after the title', () => {
      const { wrapper } = mountHeader({ title: 'Title' }, { default: () => h('button', 'Menu') });

      expect(wrapper.find('.bcds-header-title + button').text()).toBe('Menu');
    });
  });
});
