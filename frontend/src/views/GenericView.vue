<script setup lang="ts" />

<template>
  <!-- Routes can share a view component, which Vue would otherwise reuse along with the previous route's state and
       guards; keying by path mounts it fresh, while hash and query changes keep it -->
  <router-view v-slot="{ Component, route }">
    <component
      :is="Component"
      :key="route.path"
    />
  </router-view>
</template>
