<script setup lang="ts">
import { Header, Footer } from '@/components/layout';
</script>

<template>
  <div class="flex flex-col h-screen">
    <!-- Header/Nav -->
    <div class="layout-head">
      <Header />
    </div>

    <!-- Main views; focusable so the header's skip link can move focus here -->
    <main
      id="main-content"
      class="m-4 lg:mx-20 flex-auto focus:outline-none"
      tabindex="-1"
    >
      <slot name="main" />
    </main>

    <!-- Footer -->
    <footer class="shrink-0">
      <Footer />
    </footer>
  </div>
</template>
