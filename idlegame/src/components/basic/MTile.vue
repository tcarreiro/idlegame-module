<script setup lang="ts">
import { useWorld } from '@/composable/world.composable';
import type { EntityModel } from '@/models/entity.model';
import type { TileModel } from '@/models/tile.model';
import { computed, ref, type Ref } from 'vue';
import MCreature from './MCreature.vue';
import { useCreatures } from '@/composable/entity.composable';

const world = useWorld();
const creatures = useCreatures();

type MTileProps = {
  tile: TileModel,
  frameDuration?: number,
};

const props = withDefaults(defineProps<MTileProps>(), {
  frameDuration: 200, // ms
});

const isHovering:Ref<boolean> = ref(false);

const creatureRef = computed(()=> creatures.getEntityRef(props.tile.creatureId??''));

const frameIndex = computed(() => Math.floor(world.localFrameTimer.value / props.frameDuration) % props.tile.frameId.length);

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
    backgroundBlendMode: `soft-light`,
  };
});

// const getCreatureFrame = computed(() => {
//   if (!props.tile) return;
//   const size = sizeConfig.value.creatureWorldSize;
//   const col = props.slot.orientation;
//   const row = props.slot.slotFrameId[frameIndex.value];
//   const offset = size - world.TILE_CONFIG.tileWorldSize;

//   return {
//     width: `${size}px`,
//     height: `${size}px`,
//     backgroundImage: `url('/sprites/creatures/${props.slot.entity.name}_${props.slot.entityState}.png')`,
//     backgroundSize: `${sizeConfig.value.atlasNumCols * size}px auto`,
//     backgroundPosition: `-${col * size}px -${row * size}px`,
//     transform: `translate(${-offset}px, ${-offset}px)`,
//   };
// });

const onDragEnter = (event: DragEvent) => {
  if (!event.target) return;
  isHovering.value = true;
};

const onDragLeave = () => {
  isHovering.value = false;
};

const onDragOver = (event: DragEvent) => {
  event.dataTransfer!.dropEffect = 'move'; // ou 'copy', se for cópia
};


const onDrop = (event:DragEvent) => {
  isHovering.value = false;
  if (!event.dataTransfer) return;
  if (!props.tile.blocked && creatures.currentDragEntityRef.value && !creatures.entitiesOnFieldRef.has(creatures.currentDragEntityRef.value.entity.id)) {
    addOrSwapEntity(creatures.currentDragEntityRef.value);
  }
}

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

  // event.dataTransfer.effectAllowed = 'move'
  // event.dataTransfer.setData('application/json', JSON.stringify(props.slot));

  // remove preview
  setTimeout(() => {
    document.body.removeChild(dragPreview);
  }, 0);

  // world.setIsDraggingCreature(true, props.slot);
}

const onDragEnd = (event: DragEvent) => {
  const el = event.target as HTMLElement;
  creatures.setIsDraggingCreature(false, null);
}

const addOrSwapEntity = (entityRef: EntityModel) => {
  creatures.addEntityOnField(entityRef);
  if (props.tile.creatureId) {
    const oldEntity = creatures.entitiesOnFieldRef.get(props.tile.creatureId);
    if (!oldEntity?.value) return
    oldEntity.value.entity.onField = false;
    creatures.removeEntityFromField(oldEntity.value.entity.id);
  }
  props.tile.creatureId = entityRef.entity.id;
  entityRef.entity.onField = true;
};

</script>

<template>
  <div
    :class="`
      tile-wrapper
      ${isHovering?'is-hovering':''}
      ${creatures.isDraggingEntity.value?'is-dragging':''}${!props.tile.blocked?'-available':'-blocked'}
      ${props.tile.creatureId?'occupied':''}
    `"
    :style="getFrame"
    :draggable="!!props.tile.creatureId"
    @dragstart="onDragStart"
    @dragend="onDragEnd"
    @dragover.prevent="onDragOver"
    @drop="onDrop"
    @dragenter.self="onDragEnter"
    @dragleave.self="onDragLeave"
  >
  <MCreature v-if="creatureRef && creatureRef.value" :slot="creatureRef.value" />
  </div>
</template>

<style>
.tile-wrapper {
  image-rendering: pixelated;
  border: 1px solid transparent;
  background-color: rgba(0,0,0,0)!important;
  box-sizing: border-box;
}

.tile-wrapper.is-dragging-available.is-hovering {
  border-color:#34ff44;
}

.tile-wrapper.is-dragging-available {
  background-color: rgba(255,255,255,.2)!important;
}

.tile-wrapper.is-dragging-blocked {
  background-color: rgba(0,0,0,.4)!important;
}

</style>
