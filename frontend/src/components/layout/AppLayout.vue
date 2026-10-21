<script setup lang="ts">
import { Header, Footer } from '@/components/layout';
</script>

<template>
  <div class="flex flex-col h-screen">
    <!-- Header/Nav -->
    <div class="layout-head">
      <Header />
    </div>

    <!-- Main views -->
    <main class="m-4 lg:mx-20 flex-auto">
      <slot name="main" />
    </main>

    <!-- Footer -->
    <footer class="shrink-0">
      <Footer />
    </footer>
  </div>
</template>
