<script setup lang="ts">
import type { Entity } from '@/models/entity.model';
import MBorder from '../basic/MBorder.vue';
import MInput from '../basic/MInput.vue';
import MSlot from '../basic/MSlot.vue';
import { onMounted } from 'vue';

const slots = defineModel<Array<Entity>>({required:true});

const sortEntities = () => {
  slots.value.sort((a,b)=>{
    const aEmpty = a.name.trim() === "";
    const bEmpty = b.name.trim() === "";

    if (aEmpty && !bEmpty) return 1;
    if (!aEmpty && bEmpty) return -1;
    if (aEmpty && bEmpty) return 0;

    const nameCompare = a.name.localeCompare(b.name);
    if (nameCompare != 0) return nameCompare;
    return b.stats.level - a.stats.level;
  });
};

const handleClick = (slot: Entity|null) => {
  console.log(slot?.name);
};

onMounted(()=>{
  sortEntities();
});

</script>

<template>
  <MBorder inverted class="inventory-container">
    <MInput class="p-0 justify-content-center" style="width: 100%;height: 20px;"/>
    <div class="overflow-y-scroll flex flex-wrap scroll-custom slots-container" style="height: 462px; gap:5px">
      <MSlot v-for="(slot, index) in slots" :key="index" :entity="slot" :size="32" @click="handleClick"/>
    </div>
  </MBorder>
</template>

<style scoped>
.inventory-container{
  margin:2px;
  display: flex;
  justify-content: center;
}

.slots-container {
  align-items: start;
  align-content: start;
  margin: 5px;
}

</style>
