<script setup lang="ts">
import { useEntities } from '@/composable/entity.composable';
import { useWorld } from "@/composable/World.composable";
import type { Entity } from '@/models/entity.model';
import { drawSize, getDrawFromAtlas, getRendererFrameId } from '@/utils/renderer';
import { computed } from 'vue';

///////
/////// OnField Entity Component
///////

const world = useWorld();
const creatures = useEntities();

type MCreatureProps = {
  entity: Entity,
  size?:number,
  frameDuration?: number,
};

const props = withDefaults(defineProps<MCreatureProps>(), {
  frameDuration: 200, // ms
});

const emit = defineEmits(["click"]);

const frameIndex = computed(() => {
  if (!props.entity) return 0;
  return getRendererFrameId(world.localFrameTimer.value, props.frameDuration, props.entity.renderData.slotFrameId.length);
});

const getFrame = computed(() => {
  if (!props.entity) return;
  let size = props.size;
  const sizeConfig = creatures.sizeConfig(props.entity.renderData.entitySizeConfig);
  if (!size) size = sizeConfig.creatureWorldSize;

  const col = props.entity.renderData.orientation;
  const row = props.entity.renderData.slotFrameId[frameIndex.value];
  const offset = size - world.TILE_CONFIG.tileWorldSize;
  const atlasNumCols = sizeConfig.atlasNumCols;

  return {
    ...drawSize(size),
    ...getDrawFromAtlas("creatures",`${props.entity.name}_${props.entity.renderData.entityState}`, atlasNumCols, size, col, row),
    transform: `translate(${-offset}px, ${-offset}px)`,
  };
});

</script>

<template>
  <div
    class="creature-wrapper"
    :style="getFrame"
    @click="emit('click', props.entity)"
    >
  </div>
</template>

<style>
.creature-wrapper {
  image-rendering: pixelated;
  z-index:1000;
}

</style>
