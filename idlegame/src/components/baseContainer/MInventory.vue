<script setup lang="ts">
import type { EntityModel } from '@/models/entity.model';
import MBorder from '../basic/MBorder.vue';
import MInput from '../basic/MInput.vue';
import MSlot from '../basic/MSlot.vue';
import { onMounted } from 'vue';
import { useWorld } from '@/composable/world.composable';

const slots = defineModel<Array<EntityModel>>({required:true});
const world = useWorld();
const sortEntities = () => {
  slots.value.sort((a,b)=>{
    const aEmpty = a.entity.name.trim() === "";
    const bEmpty = b.entity.name.trim() === "";

    if (aEmpty && !bEmpty) return 1;
    if (!aEmpty && bEmpty) return -1;
    if (aEmpty && bEmpty) return 0;

    const nameCompare = a.entity.name.localeCompare(b.entity.name);
    if (nameCompare != 0) return nameCompare;
    return b.entity.level - a.entity.level;
  });
};

const handleClick = (slot: EntityModel|null) => {
  console.log(slot?.entity.name);
};

onMounted(()=>{
  sortEntities();
});

</script>

<template>
  <MBorder inverted class="inventory-container">
    <MInput class="p-0 justify-content-center" style="width: 100%;height: 20px;"/>
    <div class="overflow-y-scroll flex flex-wrap scroll-custom slots-container" style="height: 462px; gap:5px">
      <MSlot v-for="(slot, index) in slots" :key="index" :slot="slot" :size="32" @click="handleClick"/>
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
