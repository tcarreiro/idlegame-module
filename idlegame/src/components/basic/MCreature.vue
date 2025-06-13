<script setup lang="ts">
import { useCreatures } from '@/composable/entity.composable';
import { useWorld } from '@/composable/world.composable';
import type { EntityModel } from '@/models/entity.model';
import { EntitySize } from '@/utils/constants';
import { computed } from 'vue';

const world = useWorld();
const creatures = useCreatures();

type MCreatureProps = {
  slot: EntityModel,
  size?:number,
  frameDuration?: number,
};

const props = withDefaults(defineProps<MCreatureProps>(), {
  frameDuration: 200, // ms
});

const emit = defineEmits(["click"]);

const shouldIgnorePointerEvents = computed(() => {
  return creatures.isDraggingEntity.value
    && creatures.currentDragEntityRef.value?.entity.id !== props.slot.entity.id;
});

const sizeConfig = computed(()=>{
  switch(props.slot.entitySize) {
    case EntitySize.SMALL:
      return creatures.SMALL_ENTITY_CONFIG
    case EntitySize.MEDIUM:
      return creatures.MEDIUM_ENTITY_CONFIG
    case EntitySize.BIG:
      return creatures.BIG_ENTITY_CONFIG
  }
});

const frameIndex = computed(() => {
  if (!props.slot) return 0;
  return Math.floor(world.localFrameTimer.value / props.frameDuration) % props.slot.slotFrameId.length
});

const getFrame = computed(() => {
  if (!props.slot) return;
  let size = props.size;
  if (!size) size = sizeConfig.value.creatureWorldSize;
  const col = props.slot.orientation;
  const row = props.slot.slotFrameId[frameIndex.value];
  const offset = size - world.TILE_CONFIG.tileWorldSize;

  return {
    width: `${size}px`,
    height: `${size}px`,
    backgroundImage: `url('/sprites/creatures/${props.slot.entity.name}_${props.slot.entityState}.png')`,
    backgroundSize: `${sizeConfig.value.atlasNumCols * size}px auto`,
    backgroundPosition: `-${col * size}px -${row * size}px`,
    transform: `translate(${-offset}px, ${-offset}px)`,
  };
});

</script>

<template>
  <div
    class="creature-wrapper"
    :class="{ 'no-pointer': shouldIgnorePointerEvents }"
    :style="getFrame"
    @click="emit('click', props.slot)"
    >
  </div>
</template>

<style>
.creature-wrapper {
  image-rendering: pixelated;
  z-index:1000;
}

.no-pointer {
  pointer-events: none;
}
</style>
