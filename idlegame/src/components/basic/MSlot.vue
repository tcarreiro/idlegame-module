<script setup lang="ts">
import { useCreatures } from '@/composable/creatures.composable';
import { useWorld } from "@/composable/World.composable";
import type { CreatureDto } from '@/models/creature.model';
import { Position } from '@/models/generics.model';
import { EntityState, Orientation } from '@/utils/constants';
import { drawSize, getDrawFromAtlas, getRendererFrameId } from '@/utils/renderer';
import { computed } from 'vue';

const world = useWorld();
const creatures = useCreatures();

type MSlotProps = {
  creature: CreatureDto,
  size?:number,
  frameDuration?: number,
};

const props = withDefaults(defineProps<MSlotProps>(), {
  frameDuration: 200, // ms
});

const emit = defineEmits(["click"]);

const canDrag = computed(()=>!props.creature.onField);

const frameIndex = computed(() => {
  if (!props.creature) return 0;
  return getRendererFrameId(world.localFrameTimer.value, props.frameDuration, props.creature.baseCreature.renderData.frameIndex.length);
});

const getFrame = computed(() => {
  if (!props.creature) return;
  props.creature.baseCreature.renderData.entityState = EntityState.IDLE;
  props.creature.baseCreature.renderData.orientation = Orientation.SOUTH;
  let size = props.size;
  if (!size) size = props.creature.baseCreature.renderData.sprite.frameSize * world.TILE_CONFIG.tileWorldScale;

  const col = props.creature.baseCreature.renderData.orientation;
  const row = props.creature.baseCreature.renderData.frameIndex[frameIndex.value];
  const atlasNumCols = props.creature.baseCreature.renderData.sprite.width/props.creature.baseCreature.renderData.sprite.frameSize;
  const scale = 1.2*props.creature.baseCreature.renderData.sprite.frameSize/world.TILE_CONFIG.tileAtlasSize;

  return {
    ...drawSize(size),
    ...getDrawFromAtlas("creature",`${props.creature.baseCreature.name}_${props.creature.baseCreature.renderData.entityState}`, atlasNumCols, size*scale, col, row, new Position(0,0,0)),
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

  creatures.setDraggingCreature(props.creature);
}

const onDragEnd = (event: DragEvent) => {
  creatures.setDraggingCreature(null);
}

</script>

<template>
  <div
    class="slot-wrapper"
    :style="getFrame"
    @click="emit('click', props.creature)"
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
