<script setup lang="ts">
import { useWorld } from '@/composable/world.composable';
import MTile from '../basic/MTile.vue';
import { computed, onBeforeMount, onMounted, ref, type Ref } from 'vue';
import { Tile } from '@/models/tile.model';
import { fetchWorldMap } from '@/services/world-map.service';
import MBorder from '../basic/MBorder.vue';

const world = useWorld();

const loadingMap:Ref<boolean> = ref(false);
  
const getWorldData = async () => {
  const tiles:Ref<Array<Tile>> = ref([]);
  try {
    loadingMap.value = true;
    tiles.value = await fetchWorldMap();

    world.setWorldTiles(tiles.value);
    
  } catch (error) {
    console.error(error);
  } finally {
    loadingMap.value = false;
  }
};

onBeforeMount(() => {
  getWorldData();
});

const numCols = computed(() => Math.max(...world.worldTiles.value.map(t => t.position.x)) + 1);
const numRows = computed(() => Math.max(...world.worldTiles.value.map(t => t.position.y)) + 1);

const worldGridStyle = computed(() => ({
  display: 'grid',
  gridTemplateColumns: `repeat(${numCols.value}, ${world.TILE_CONFIG.tileWorldSize}px)`,
  gridTemplateRows: `repeat(${numRows.value}, ${world.TILE_CONFIG.tileWorldSize}px)`,
}));

</script>

<template>
  <MBorder>
    <div :style="worldGridStyle">
      <MTile v-for="(tile, index) in world.worldTiles.value" :key="index" :tile="tile" @click="(tile:Tile)=>console.log(tile)" />
    </div>
  </MBorder>
</template>

<style scoped>
</style>
