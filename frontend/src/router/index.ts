import { createRouter, createWebHistory } from 'vue-router';

import oidcRoutes from '@/router/oidc';
import { AuthService } from '@/services';
import { useAppStore, useAuthNStore, useConfigStore } from '@/store';
import { RouteName, StorageKey } from '@/utils/enums/application';

import type { LocationQuery, RouteParamsGeneric, RouteRecordRaw } from 'vue-router';

/**
 * Obtains any information that should be loaded only once on hard navigation.
 */
async function bootstrap() {
  const appStore = useAppStore();
  const authnStore = useAuthNStore();
  const configStore = useConfigStore();

  appStore.beginDeterminateLoading();

  await configStore.init();
  await authnStore.init();

  appStore.endDeterminateLoading();
}

/**
 * Parses the route query and params to generate Vue props.
 * @param route - The route object.
 * @returns A Vue props object.
 */
export function createProps(route: { query: LocationQuery; params: RouteParamsGeneric }): object {
  return { ...route.query, ...route.params };
}

function convertRemToPixels(rem: number) {
  const pixels = rem * Number.parseFloat(getComputedStyle(document.documentElement).fontSize);
  return pixels || 64;
}

// Content loads after navigation, so wait until the scroll target can actually be reached
function waitFor(ready: () => boolean, timeout = 2000): Promise<void> {
  const start = performance.now();
  return new Promise((resolve) => {
    const check = () => (ready() || performance.now() - start > timeout ? resolve() : requestAnimationFrame(check));
    check();
  });
}

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/views/GenericView.vue'),
    beforeEnter: bootstrap,
    children: [
      {
        path: '/',
        name: RouteName.HOME,
        component: () => import('@/views/HomeView.vue'),
        meta: { hideBreadcrumb: true }
      },
      {
        path: '/developer',
        name: RouteName.DEVELOPER,
        component: () => import('@/views/DeveloperView.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/forbidden',
        name: RouteName.FORBIDDEN,
        component: () => import('@/views/ForbiddenView.vue')
      },

      ...oidcRoutes,

      {
        path: '/:pathMatch(.*)*',
        name: RouteName.NOT_FOUND,
        component: () => import('@/views/NotFoundView.vue'),
        meta: { hideBreadcrumb: true }
      }
    ]
  }
];

/**
 * Creates the app router with the authentication guard, loading indicator hooks and scroll behaviour.
 * @returns The configured router.
 */
export default function getRouter() {
  const appStore = useAppStore();
  const authService = new AuthService();

  const router = createRouter({
    history: createWebHistory(),
    routes,
    // Views with tabs should keep the active tab in the query, or a restored position lands on the wrong layout
    scrollBehavior(to, from, savedPosition) {
      if (savedPosition) {
        const { top } = savedPosition;
        return waitFor(() => document.documentElement.scrollHeight - window.innerHeight >= top).then(
          () => savedPosition
        );
      }
      if (to.hash) {
        return waitFor(() => !!document.querySelector(to.hash)).then(() => ({
          el: to.hash,
          behavior: 'smooth' as const,
          top: convertRemToPixels(5)
        }));
      }
      // Query or hash changes on the same page keep the scroll position
      if (to.path === from.path) return false;
      return { top: 0 };
    }
  });

  router.beforeEach(async (to) => {
    appStore.beginDeterminateLoading();

    // Authentication guard
    if (to.meta.requiresAuth) {
      const user = await authService.getUser();
      if (!user || user.expired) {
        globalThis.sessionStorage.setItem(StorageKey.AUTH, `${to.fullPath}`);
        return { name: RouteName.OIDC_LOGIN };
      }
    }
  });

  router.afterEach(() => {
    appStore.endDeterminateLoading();
  });

  return router;
}
