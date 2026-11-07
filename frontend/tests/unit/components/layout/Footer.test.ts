import Footer from '@/components/layout/Footer.vue';

import { mountComponent } from '../../../mountComponent';

// Mocks

// Fixtures

const testContactLinks = [
  'https://www2.gov.bc.ca/gov/content?id=6A77C17D0CCB48F897F8598CCC019111',
  'https://www2.gov.bc.ca/gov/content?id=FBC4210F6BC047A5884198F543C97D53'
];

// Mount

function mountFooter() {
  const { wrapper } = mountComponent(Footer);

  return { wrapper };
}

// Tests

describe('Footer', () => {
  describe('rendering', () => {
    it('renders every footer link', () => {
      const { wrapper } = mountFooter();

      expect(wrapper.findAll('a')).toHaveLength(9);
    });

    it('renders the contact links inside the contact sentence', () => {
      const { wrapper } = mountFooter();
      const contact = wrapper.findAll('p').find((p) => p.find('a').exists());

      expect(contact?.text()).toContain('Call, email or text us, or find a service centre');
      expect(contact?.findAll('a').map((link) => link.attributes('href'))).toEqual(testContactLinks);
    });
  });
});
