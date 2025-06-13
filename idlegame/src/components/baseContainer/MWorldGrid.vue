<script setup lang="ts">
import { useWorld } from '@/composable/world.composable';
import MTile from '../basic/MTile.vue';
import { computed, onMounted, ref, type Ref } from 'vue';
import type { TileModel } from '@/models/tile.model';
import { fetchWorldMap } from '@/services/world-map.service';
import MBorder from '../basic/MBorder.vue';

const world = useWorld();

const tiles:Ref<Array<TileModel>> = ref([]);
const loadingMap:Ref<boolean> = ref(false);

const getWorldData = async () => {
  try {
    loadingMap.value = true;
    tiles.value = await fetchWorldMap();
  } catch (error) {
    console.error(error);
  } finally {
    loadingMap.value = false;
  }
};

onMounted(() => {
  getWorldData();
});

const numCols = computed(() => Math.max(...tiles.value.map(t => t.position.x)) + 1);
const numRows = computed(() => Math.max(...tiles.value.map(t => t.position.y)) + 1);

const worldGridStyle = computed(() => ({
  display: 'grid',
  gridTemplateColumns: `repeat(${numCols.value}, ${world.TILE_CONFIG.tileWorldSize}px)`,
  gridTemplateRows: `repeat(${numRows.value}, ${world.TILE_CONFIG.tileWorldSize}px)`,
}));

</script>

<template>
  <MBorder>
    <div :style="worldGridStyle">
      <MTile v-for="(tile, index) in tiles" :key="index" :tile="tile" @onClick="(tile)=>console.log(tile)" />
    </div>
  </MBorder>
</template>

<style scoped>
</style>
