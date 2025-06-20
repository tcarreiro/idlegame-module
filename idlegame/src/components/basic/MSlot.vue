<script setup lang="ts">
import { useEntities } from '@/composable/entity.composable';
import type { Entity } from '@/models/entity.model';
import { useWorld } from "@/composable/World.composable";
import { drawSize, getDrawFromAtlas, getRendererFrameId } from '@/utils/renderer';
import { computed } from 'vue';

const world = useWorld();
const creatures = useEntities();

type MSlotProps = {
  entity: Entity,
  size?:number,
  frameDuration?: number,
};

const props = withDefaults(defineProps<MSlotProps>(), {
  frameDuration: 200, // ms
});

const emit = defineEmits(["click"]);

const canDrag = computed(()=>!!props.entity.name && !props.entity.onField);

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
  const atlasNumCols = sizeConfig.atlasNumCols;
  const scale = 1.2*sizeConfig.creatureAtlasSize/world.TILE_CONFIG.tileAtlasSize;

  return {
    ...drawSize(size),
    ...getDrawFromAtlas("creature",`${props.entity.name}_${props.entity.renderData.entityState}`, atlasNumCols, size*scale, col, row, props.entity.renderData.slotOffset),
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
  event.dataTransfer.setData('application/json', JSON.stringify({source:"slot"}));

  // remove preview
  setTimeout(() => {
    document.body.removeChild(dragPreview);
  }, 0);

  creatures.setDraggingEntity(props.entity);
}

const onDragEnd = (event: DragEvent) => {
  creatures.setDraggingEntity(null);
}

</script>

<template>
  <div
    class="slot-wrapper"
    :style="getFrame"
    @click="emit('click', props.entity)"
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
