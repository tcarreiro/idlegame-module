<script setup lang="ts">
import { useWorld } from "@/composable/World.composable";
import MTile from '../basic/MTile.vue';
import { computed, onBeforeMount, onMounted, ref, type Ref } from 'vue';
import { WorldTileDto } from '@/models/tile.model';
import { fetchWorldMap } from '@/services/world-map.service';
import MBorder from '../basic/MBorder.vue';
import type { FrameDto } from "@/models/frame.model";

const world = useWorld();

// creation purpose
const selectedFrame = defineModel<FrameDto|null>({required:false, default:null});
const numCols = computed(() => Math.max(...world.worldTiles.value.map(t => t.position.x)) + 1);
const numRows = computed(() => Math.max(...world.worldTiles.value.map(t => t.position.y)) + 1);
const worldGridStyle = computed(() => ({
  position: 'relative',
  width: `${(numCols.value) * world.TILE_CONFIG.tileWorldSize}px`,
  height: `${(numRows.value) * world.TILE_CONFIG.tileWorldSize}px`,
} as const));

const getTileStyle = (tile: WorldTileDto) => ({
  position: 'absolute',
  left: `${tile.position.x * world.TILE_CONFIG.tileWorldSize}px`,
  top: `${tile.position.y * world.TILE_CONFIG.tileWorldSize}px`,
} as const);

const handleClick = (newtile:WorldTileDto) => {
  if (selectedFrame.value) {
    world.swapTile(newtile.position, selectedFrame.value);
  }
}

const handleRightClick = (newtile:WorldTileDto) => {
  if (newtile.tileCover.length) {
    world.removeLastCover(newtile.position);
  }
}

</script>

<template>
  <MBorder>
    <div :style="worldGridStyle">
      <div
        v-for="(tile, index) in world.worldTiles.value"
        :key="index"
        :style="getTileStyle(tile)"
      >
      <MTile :tile="tile" @click="handleClick" @contextClick="handleRightClick"/>
      </div>
    </div>
  </MBorder>
</template>

<style scoped>
</style>
