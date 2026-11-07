// PrimeVue's toast service posts messages to this bus for <Toast /> to show; it ships without types
declare module 'primevue/toasteventbus' {
  const ToastEventBus: { emit(type: string, evt?: unknown): void };
  export default ToastEventBus;
}
