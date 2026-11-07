<script setup lang="ts">
defineSlots<{
  content?(): unknown;
  footer?(): unknown;
  header?(): unknown;
  subtitle?(): unknown;
  title?(): unknown;
}>();
</script>

<template>
  <div class="card">
    <div
      v-if="$slots.header"
      class="header"
    >
      <slot name="header" />
    </div>
    <div class="body">
      <div
        v-if="$slots.title || $slots.subtitle"
        class="caption"
      >
        <div
          v-if="$slots.title"
          class="title"
        >
          <slot name="title" />
        </div>
        <div
          v-if="$slots.subtitle"
          class="subtitle"
        >
          <slot name="subtitle" />
        </div>
      </div>
      <div class="content">
        <slot name="content" />
      </div>
      <div
        v-if="$slots.footer"
        class="footer"
      >
        <slot name="footer" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
  border: var(--layout-border-width-small) solid var(--surface-color-border-default);
  border-radius: var(--layout-border-radius-large);
  background: var(--surface-color-background-white);
  box-shadow:
    0 2px 1px -1px rgba(0, 0, 0, 0.2),
    0 1px 1px 0 rgba(0, 0, 0, 0.14),
    0 1px 3px 0 rgba(0, 0, 0, 0.12);
  color: var(--typography-color-primary);
}

.body {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: var(--layout-padding-medium);
}

.caption {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.title {
  font-size: var(--typography-font-size-body);
  font-weight: 500;
}

.subtitle {
  color: var(--typography-color-secondary);
}
</style>
