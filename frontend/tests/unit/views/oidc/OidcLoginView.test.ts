import { IdentityProviderKind } from '@/utils/enums/application';
import OidcLoginView from '@/views/oidc/OidcLoginView.vue';

import { mockAuthNStore, resetMockAuthNStore } from '../../../mockAuthNStore';
import { mountComponent } from '../../../mountComponent';

// Mocks

vi.mock('@/store/authnStore', () => ({
  default: () => mockAuthNStore,
  useAuthNStore: () => mockAuthNStore
}));

// Fixtures

const testIdpList = [
  { kind: IdentityProviderKind.BCSC, idp: 'bcsc', username: '' },
  { kind: IdentityProviderKind.BCEID, idp: 'bceidbasic', username: '' },
  { kind: IdentityProviderKind.BCEIDBUSINESS, idp: 'bceidbusiness', username: '' },
  { kind: IdentityProviderKind.AZUREIDIR, idp: 'azureidir', username: '' }
];

// Mount

function mountOidcLoginView() {
  const { wrapper } = mountComponent(OidcLoginView, {
    piniaState: { config: { config: { idpList: testIdpList } } }
  });

  return { wrapper };
}

beforeEach(() => {
  resetMockAuthNStore();
});

// Tests

describe('OidcLoginView', () => {
  describe('user interaction', () => {
    it.each([
      ['bcsc-login-button', 'bcsc'],
      ['bceid-login-button', 'bceidbasic'],
      ['bceid-business-login-button', 'bceidbusiness'],
      ['idir-mfa-login-button', 'azureidir']
    ])('logs in with the matching identity provider when %s is clicked', async (button, idp) => {
      const { wrapper } = mountOidcLoginView();

      await wrapper.find(`[data-test="${button}"]`).trigger('click');

      expect(mockAuthNStore.login).toHaveBeenCalledWith(idp);
    });
  });
});
