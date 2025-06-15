<script setup lang="ts">
import { useWorld } from "@/composable/World.composable";
import MTile from '../basic/MTile.vue';
import { computed, onMounted } from 'vue';
import { Tile } from '@/models/tile.model';
import MBorder from '../basic/MBorder.vue';

const world = useWorld();

const selectedId = defineModel<number>({required:true});
const numCols = computed(() => Math.max(...world.worldTiles.value.map(t => t.position.x)) + 1);
const numRows = computed(() => Math.max(...world.worldTiles.value.map(t => t.position.y)) + 1);
const worldGridStyle = computed(() => ({
  display: 'grid',
  gridTemplateColumns: `repeat(${numCols.value}, ${world.TILE_CONFIG.tileWorldSize}px)`,
  gridTemplateRows: `repeat(${numRows.value}, ${world.TILE_CONFIG.tileWorldSize}px)`,
}));

onMounted(()=>{
  world.isCreatingWorld.value = true;
});

const handleAddTile = (newtile:Tile) => {
  if (selectedId.value !== -1 && world.selectedTile.value) {
    world.swapTile(newtile.position, world.selectedTile.value.baseTile.spriteName, world.selectedTile.value.baseTile.frameId[0])
  }
}

</script>

<template>
  <MBorder>
    <div :style="worldGridStyle">
      <MTile v-for="(tile, index) in world.worldTiles.value" :key="index" :tile="tile" @click="handleAddTile(tile)" />
    </div>
  </MBorder>
</template>

<style scoped>
</style>
