import { RouteName } from '@/utils/enums/application';

import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/oidc',
    meta: { hideBreadcrumb: true, hideAppDrawer: true },
    children: [
      {
        path: 'callback',
        name: RouteName.OIDC_CALLBACK,
        component: () => import('@/views/oidc/OidcCallbackView.vue')
      },
      {
        path: 'login',
        name: RouteName.OIDC_LOGIN,
        component: () => import('@/views/oidc/OidcLoginView.vue')
      },
      {
        path: 'logout',
        name: RouteName.OIDC_LOGOUT,
        component: () => import('@/views/oidc/OidcLogoutView.vue')
      }
    ]
  }
];

export default routes;
