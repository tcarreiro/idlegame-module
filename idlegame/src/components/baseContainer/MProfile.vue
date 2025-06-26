<script setup lang="ts">
import MSlot from '../basic/MSlot.vue';
import type { CreatureDto } from '@/models/creature.model';

const slot = defineModel<CreatureDto>({required:true});

</script>

<template>
  <div class="overflow-y-auto flex flex-wrap scroll-custom slots-container" style="height: 479px; gap:5px">
    <MSlot :creature="slot" :size="39"/>
  </div>
</template>

<style scoped>
.slots-container {
  align-items: start;
  margin: 5px;
}

</style>
