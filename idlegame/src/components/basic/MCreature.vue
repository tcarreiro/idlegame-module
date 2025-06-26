<script setup lang="ts">
import { useCreatures } from '@/composable/creatures.composable';
import { useWorld } from "@/composable/World.composable";
import type { CreatureDto } from '@/models/creature.model';
import { drawSize, getDrawFromAtlas, getRendererFrameId } from '@/utils/renderer';
import { computed } from 'vue';

///////
/////// OnField Entity Component
///////

const world = useWorld();
const creatures = useCreatures();

type MCreatureProps = {
  creature: CreatureDto,
  size?:number,
  frameDuration?: number,
};

const props = withDefaults(defineProps<MCreatureProps>(), {
  frameDuration: 200, // ms
});

const emit = defineEmits(["click"]);

const frameIndex = computed(() => {
  if (!props.creature) return 0;
  return getRendererFrameId(world.localFrameTimer.value, props.frameDuration, props.creature.baseCreature.renderData.frameIndex.length);
});

const getFrame = computed(() => {
  if (!props.creature) return;

  let size = props.size;
  if (!size) size = props.creature.baseCreature.renderData.sprite.frameSize * world.TILE_CONFIG.tileWorldScale;

  const col = props.creature.baseCreature.renderData.orientation;
  const row = props.creature.baseCreature.renderData.frameIndex[frameIndex.value];
  const offset = size - world.TILE_CONFIG.tileWorldSize;
  const atlasNumCols = props.creature.baseCreature.renderData.sprite.width/props.creature.baseCreature.renderData.sprite.frameSize;

  return {
    ...drawSize(size),
    ...getDrawFromAtlas("creature",`${props.creature.baseCreature.name}_${props.creature.baseCreature.renderData.entityState}`, atlasNumCols, size, col, row),
    transform: `translate(${-offset + props.creature.baseCreature.renderData.position.x}px, ${-offset + props.creature.baseCreature.renderData.position.y}px)`,
  };
});

</script>

<template>
  <div
    class="creature-wrapper"
    :style="getFrame"
    @click="emit('click', props.creature)"
    >
  </div>
</template>

<style>
.creature-wrapper {
  image-rendering: pixelated;
  z-index:1000;
}

</style>
