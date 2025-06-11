<script setup lang="ts">
  import { useWorld } from '@/composable/World.composable';
  import MContainer from './MContainer.vue';
  import MSlot from './MSlot.vue';
  import { onMounted, ref, type Ref } from 'vue';
  import type { BeastModel } from '@/models/beast.model';
  import type { ItemModel } from '@/models/item.model';

  const world = useWorld();

  const inventory:Ref<Array<BeastModel|ItemModel>> = ref([]);
  const loadingMap:Ref<boolean> = ref(false);
  const draggingSlot:Ref<boolean> = ref(false);

  const getWorldData = async () => {
    try {
      loadingMap.value = true;
      inventory.value = [
        {
          frameId:[0],
          id: "",
          level: 1,
          spriteName:"empty"
        },
        {
          frameId:[0],
          id: "",
          level: 1,
          spriteName:"empty"
        },
        {
          frameId:[0],
          id: "",
          level: 1,
          spriteName:"empty"
        },
        {
          frameId:[0],
          id: "",
          level: 1,
          spriteName:"empty"
        },
        {
          frameId:[0],
          id: "",
          level: 1,
          spriteName:"empty"
        },
        {
          frameId:[0],
          id: "",
          level: 1,
          spriteName:"empty"
        },
        {
          frameId:[0],
          id: "",
          level: 1,
          spriteName:"empty"
        },
        {
          frameId:[0],
          id: "",
          level: 1,
          spriteName:"empty"
        },
        {
          frameId:[0],
          id: "",
          level: 1,
          spriteName:"empty"
        },
        {
          frameId:[0],
          id: "",
          level: 1,
          spriteName:"empty"
        },
        {
          frameId:[0],
          id: "",
          level: 1,
          spriteName:"empty"
        },
        {
          frameId:[0],
          id: "",
          level: 1,
          spriteName:"empty"
        },
        {
          frameId:[0],
          id: "",
          level: 1,
          spriteName:"empty"
        },
        {
          frameId:[0],
          id: "",
          level: 1,
          spriteName:"empty"
        },
        {
          frameId:[0],
          id: "",
          level: 1,
          spriteName:"empty"
        },
        {
          frameId:[0],
          id: "",
          level: 1,
          spriteName:"empty"
        },
        {
          frameId:[0],
          id: "",
          level: 1,
          spriteName:"empty"
        },
        {
          frameId:[0],
          id: "",
          level: 1,
          spriteName:"empty"
        },
        {
          frameId:[0],
          id: "",
          level: 1,
          spriteName:"empty"
        },
        {
          frameId:[0],
          id: "",
          level: 1,
          spriteName:"empty"
        },
        {
          frameId:[0],
          id: "",
          level: 1,
          spriteName:"empty"
        },
        {
          frameId:[0],
          id: "",
          level: 1,
          spriteName:"empty"
        },
        {
          frameId:[0],
          id: "",
          level: 1,
          spriteName:"empty"
        },
        {
          frameId:[0],
          id: "",
          level: 1,
          spriteName:"empty"
        },
        {
          frameId:[0],
          id: "",
          level: 1,
          spriteName:"empty"
        },
        {
          frameId:[0],
          id: "",
          level: 1,
          spriteName:"empty"
        },
        {
          frameId:[0],
          id: "",
          level: 1,
          spriteName:"empty"
        },
        {
          frameId:[0],
          id: "",
          level: 1,
          spriteName:"empty"
        },
        {
          frameId:[0],
          id: "",
          level: 1,
          spriteName:"empty"
        },
        {
          frameId:[0],
          id: "",
          level: 1,
          spriteName:"empty"
        },
        {
          frameId:[0],
          id: "",
          level: 1,
          spriteName:"empty"
        },
        {
          frameId:[0],
          id: "",
          level: 1,
          spriteName:"empty"
        },
        {
          frameId:[0],
          id: "",
          level: 1,
          spriteName:"empty"
        },
        {
          frameId:[0],
          id: "",
          level: 1,
          spriteName:"empty"
        }
      ];
    } catch (error) {
      console.error(error);
    } finally {
      loadingMap.value = false;
    }
  };

  onMounted(() => {
    getWorldData();
  });
</script>

<template>
  <MSlot v-for="(slot, index) in inventory" :key="index"
    v-model:dragging="draggingSlot"
    :slotId="index"
    :parentInventoryId="'1'"
    :content="slot"
    @on-click="console.log(slot)"
  />
</template>
