<script setup lang="ts">
import { useCreatures } from '@/composable/entity.composable';
import { useWorld } from '@/composable/world.composable';
import type { EntityModel } from '@/models/entity.model';
import { EntitySize } from '@/utils/constants';
import { computed } from 'vue';

const world = useWorld();
const creatures = useCreatures();

type MSlotProps = {
  slot: EntityModel,
  size?:number,
  frameDuration?: number,
};

const props = withDefaults(defineProps<MSlotProps>(), {
  frameDuration: 200, // ms
});

const emit = defineEmits(["click"]);

const canDrag = computed(()=>!!props.slot.entity.name && !props.slot.entity.onField);
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

  return {
    width: `${size}px`,
    height: `${size}px`,
    backgroundImage: `url('/sprites/creatures/${props.slot.entity.name}_${props.slot.entityState}.png')`,
    backgroundSize: `${sizeConfig.value.atlasNumCols * sizeConfig.value.creatureWorldSize}px auto`,
    backgroundPosition: `-${col * sizeConfig.value.creatureWorldSize + props.slot.slotOffset.x}px -${row * sizeConfig.value.creatureWorldSize + props.slot.slotOffset.y}px`,
  };
});

const onDragStart = (event:DragEvent) => {
  if (!event.dataTransfer) return

  // Create preview
  const dragPreview = document.createElement('div');

  const style = getFrame.value;
  if (style) {
    const previewStyle = {
      ...style,
      transform: 'scale(2.0)',
      position: 'absolute',
      top: '-1000px',
      left: '-1000px',
      border: 'none',
      cursor: 'grabbing',
      imageRendering: 'pixelated',
    };

    Object.entries(previewStyle).forEach(([key, value]) => {
      (dragPreview.style as any)[key] = value;
    });
  }

  document.body.appendChild(dragPreview);
  // Cursor position inside preview
  const offsetX = (dragPreview.offsetWidth) / 2;
  const offsetY = (dragPreview.offsetHeight) / 2;

  event.dataTransfer.setDragImage(dragPreview, offsetX, offsetY);

  event.dataTransfer.effectAllowed = 'move'
  event.dataTransfer.setData('application/json', JSON.stringify(props.slot));

  // remove preview
  setTimeout(() => {
    document.body.removeChild(dragPreview);
  }, 0);

  creatures.setIsDraggingCreature(true, props.slot);
}

const onDragEnd = (event: DragEvent) => {
  creatures.setIsDraggingCreature(false, null);
}

</script>

<template>
  <div
    class="slot-wrapper"
    :style="getFrame"
    @click="emit('click', props.slot)"
    :draggable="canDrag"
    @dragstart="onDragStart"
    @dragend="onDragEnd"
  >
  <div class="unavailable" v-if="!canDrag"></div>
  </div>
</template>

<style>
.slot-wrapper {
  image-rendering: pixelated;
  border: 1px solid #121212;
  background-color: #242424;
  cursor: grab;
}

.unavailable {
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,.4);
}

</style>
