import { createToastManager } from 'reka-ui';

export type ToastSeverity = 'danger' | 'info' | 'success' | 'warning';

// Adds toasts from anywhere, even outside setup(); Toaster shows them.
export const toastManager = createToastManager<{ severity: ToastSeverity }>();
