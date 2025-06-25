<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useApp } from './stores/app';

const appStore = useApp();

</script>

<template>
  <RouterView />
</template>

<style scoped>
</style>
