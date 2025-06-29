<script setup lang="ts">
import { useWorld } from "@/composable/World.composable";
import MTile from '../basic/MTile.vue';
import { computed } from 'vue';
import { WorldTileDto } from '@/models/tile.model';
import MBorder from '../basic/MBorder.vue';
import type { FrameDto } from "@/models/frame.model";
import { useCreatures } from "@/composable/creatures.composable";
import MCreature from "../basic/MCreature.vue";

const world = useWorld();
const creatures = useCreatures();

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

const handleClick = (tile:WorldTileDto) => {
  if (world.isCreatingWorld.value) {
    if (selectedFrame.value) {
      world.swapTile(tile.position, selectedFrame.value);
    }
  }
}

const handleRightClick = (tile:WorldTileDto) => {
  if (world.isCreatingWorld.value) {
    if (tile.tileCover.length) {
      world.removeLastCover(tile.position);
    }
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
      <div
        v-for="(creature, index) in creatures.creaturesOnField.value"
        :key="index"
      >
        <MCreature v-if="creature" class="creature" :creature="creature" />
      </div>
    </div>
  </MBorder>
</template>

<style scoped>

.creature {
  position: absolute;
  image-rendering: pixelated;
  z-index: 10002;
}

</style>
