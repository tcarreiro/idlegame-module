<script setup lang="ts">
import type { EntityModel } from '@/models/entity.model';
import MSlot from '../basic/MSlot.vue';

const slot = defineModel<EntityModel>({required:true});

</script>

<template>
  <div class="overflow-y-auto flex flex-wrap scroll-custom slots-container" style="height: 479px; gap:5px">
    <MSlot :slot="slot" :size="39"/>
  </div>
</template>

<style scoped>
.slots-container {
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(4, 200px);
  align-items: start;
  margin: 5px;
}

</style>
