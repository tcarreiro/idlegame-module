<script setup lang="ts">
import type { Entity } from '@/models/entity.model';
import MSlot from '../basic/MSlot.vue';

const slot = defineModel<Entity>({required:true});

</script>

<template>
  <div class="overflow-y-auto flex flex-wrap scroll-custom slots-container" style="height: 479px; gap:5px">
    <MSlot :entity="slot" :size="39"/>
  </div>
</template>

<style scoped>
.slots-container {
  align-items: start;
  margin: 5px;
}

</style>
