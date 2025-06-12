<script setup lang="ts">
import { useWorld } from '@/composable/world.composable';
import type { TileModel } from '@/models/tile.model';
import { computed } from 'vue';

const world = useWorld();

type MTileProps = {
  tile: TileModel,
  frameDuration?: number,
};

const props = withDefaults(defineProps<MTileProps>(), {
  frameDuration: 300, // ms
});

const frameIndex = computed(() => {
  const duration = props.frameDuration;
  const totalFrames = props.tile.frameId.length;
  const currentFrame = Math.floor(world.worldTime.value / duration) % totalFrames;
  return currentFrame;
});

const getFrame = computed(() => {
  const frameNum = props.tile.frameId[frameIndex.value];

  const col = frameNum % world.TILE_CONFIG.atlasNumCols;
  const row = Math.floor(frameNum / world.TILE_CONFIG.atlasNumCols);

  return {
    width: `${world.TILE_CONFIG.tileWorldSize}px`,
    height: `${world.TILE_CONFIG.tileWorldSize}px`,
    backgroundImage: `url('/sprites/tiles/${props.tile.spriteName}.png')`,
    backgroundSize: `${world.TILE_CONFIG.atlasNumCols * world.TILE_CONFIG.tileWorldSize}px auto`,
    backgroundPosition: `-${col * world.TILE_CONFIG.tileWorldSize}px -${row * world.TILE_CONFIG.tileWorldSize}px`,
  };
});
</script>


<template>
  <div class="tile-wrapper" :style="getFrame"></div>
</template>

<style>
.tile-wrapper {
  image-rendering: pixelated;
}
</style>
