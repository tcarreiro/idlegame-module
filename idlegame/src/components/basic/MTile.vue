<script setup lang="ts">
import { useWorld } from "@/composable/World.composable";
import type { WorldTileDto } from '@/models/tile.model';
import { computed, ref, type Ref } from 'vue';
import MCreature from './MCreature.vue';
import { useEntities } from '@/composable/entity.composable';
import { drawSize, getDrawFromAtlas, getRendererFrameId } from '@/utils/renderer';

const world = useWorld();
const creatures = useEntities();

type MTileProps = {
  tile: WorldTileDto,
  frameDuration?: number,
};

const props = withDefaults(defineProps<MTileProps>(), {
  frameDuration: 200, // ms
});

const emit = defineEmits(["click", "contextClick"]);

const isHovering:Ref<boolean> = ref(false);

const entityRef = computed(()=> creatures.getEntityOnField(props.tile.presentEntity??""));
const enablePlaceCreature = computed(()=>!props.tile.isBlocked() && creatures.entityBeingDrag.value);
const baseTileFrameIndex = computed(() => getRendererFrameId(world.localFrameTimer.value, props.frameDuration, props.tile.baseTile.frameId.length));
const coverTileFrameIndex = computed(() => (index:number) => getRendererFrameId(world.localFrameTimer.value, props.frameDuration, props.tile.tileCover[index].frameId.length));
const shouldIgnorePointerEvents = computed(() => !!creatures.entityBeingDrag.value);

const getCoverTileFrame = computed(() => (index:number) => {

  const frameNum = props.tile.tileCover[index].frameId[coverTileFrameIndex.value(index)];

  const sprite = props.tile.tileCover[index].sprite;

  const size = world.TILE_CONFIG.tileWorldScale*sprite.frameSize;
  const atlasNumCols = sprite.width/sprite.frameSize;
  const col = frameNum % atlasNumCols;
  const row = Math.floor(frameNum / atlasNumCols);

  return {
    ...drawSize(size),
    ...getDrawFromAtlas("coverTile/",sprite.name, atlasNumCols, size, col, row),
  };
});

const getBaseTileFrame = computed(() => {
  const frameNum = props.tile.baseTile.frameId[baseTileFrameIndex.value];

  const sprite = props.tile.baseTile.sprite;

  const size = world.TILE_CONFIG.tileWorldScale*sprite.frameSize;
  const atlasNumCols = sprite.width/sprite.frameSize;
  const col = frameNum % atlasNumCols;
  const row = Math.floor(frameNum / atlasNumCols);

  return {
    ...drawSize(size),
    ...getDrawFromAtlas("baseTile/",sprite.name, atlasNumCols, size, col, row),
    backgroundBlendMode: `soft-light`,
  };
});

const getCreatureFrame = () => {
  if (!props.tile || !entityRef.value) return;
  const sizeConfig = creatures.sizeConfig(entityRef.value.renderData.entitySizeConfig);
  const size = sizeConfig.creatureWorldSize;
  const atlasNumCols = world.TILE_CONFIG.atlasNumCols;
  const col = entityRef.value.renderData.orientation;
  const row = entityRef.value.renderData.slotFrameId[baseTileFrameIndex.value];
  const offset = size - world.TILE_CONFIG.tileWorldSize;

  return {
    ...drawSize(size),
    ...getDrawFromAtlas("creatures",`${entityRef.value.name}_${entityRef.value.renderData.entityState}`, atlasNumCols, size, col, row),
    transform: `translate(${-offset}px, ${-offset}px)`,
  };
};

const onDragEnter = (event: DragEvent) => {
  if (!event.target) return;
  isHovering.value = true;
};

const onDragLeave = (event: DragEvent) => {
  isHovering.value = false;
};

const onDragOver = (event: DragEvent) => {
  event.dataTransfer!.dropEffect = 'move'; // ou 'copy', se for cópia
};

const onDrop = (event:DragEvent) => {
  isHovering.value = false;
  if (!event.dataTransfer) return;
  const source = JSON.parse(event.dataTransfer!.getData("application/json")).source;
  if (enablePlaceCreature.value) {
    world.addEntityOnTile(creatures.entityBeingDrag.value!, props.tile);
  }
}

const onDragStart = (event:DragEvent) => {
  if (!event.dataTransfer || !entityRef.value) return;

  // Create preview
  const dragPreview = document.createElement('div');

  const creatureStyle = getCreatureFrame();
  // const style = getFrame.value;
  if (creatureStyle) {
    const previewStyle = {
      ...creatureStyle,
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
  event.dataTransfer.setData('application/json', JSON.stringify({source:"tile", entity:props.tile}));

  // remove preview
  setTimeout(() => {
    document.body.removeChild(dragPreview);
  }, 0);

  creatures.setDraggingEntity(entityRef.value);
}

const onDragEnd = (event: DragEvent) => {
  creatures.setDraggingEntity(null);
}

const onMouseEnter = (event: MouseEvent) => {
  if (world.isCreatingWorld.value) {
    isHovering.value = true;
  }
}

const onMouseLeave = (event: MouseEvent) => {
  if (world.isCreatingWorld.value) {
    isHovering.value = false;
  }
}

</script>

<template>
  <div
    :class="`
      tile-wrapper
      ${isHovering?'is-hovering':''}
      ${creatures.entityBeingDrag.value?'is-dragging':''}
      ${!props.tile.isBlocked()?'available':'blocked'}
      ${props.tile.presentEntity?'occupied':''}
    `"
    @click="emit('click', props.tile)"
    @contextmenu.prevent="emit('contextClick', props.tile)"
    :style="getBaseTileFrame"
    :draggable="!!props.tile.presentEntity"
    @dragstart="onDragStart"
    @dragend="onDragEnd"
    @dragover.prevent="onDragOver"
    @drop="onDrop"
    @dragenter.self="onDragEnter"
    @dragleave.self="onDragLeave"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
  >
    <div
      v-for="(ct, index) in props.tile.tileCover"
      class="cover-tile border"
      :class="{ 'no-pointer': shouldIgnorePointerEvents,
        'is-dragging': creatures.entityBeingDrag.value,
        'available': !props.tile.isBlocked(),
        'blocked': props.tile.isBlocked()
      }"
      :style="getCoverTileFrame(index)"
    ></div>
    <MCreature v-if="entityRef" :entity="entityRef" :class="{ 'no-pointer': shouldIgnorePointerEvents }"/>
  </div>
</template>

<style lang="scss">
.tile-wrapper {
  position: relative;
  image-rendering: pixelated;
  box-sizing: border-box;
}

.border {
  box-shadow: inset 0 0 0 1px transparent;
}

.border:hover,
.tile-wrapper.is-hovering,
.tile-wrapper.is-dragging.available.is-hovering {
  box-shadow: inset 0 0 0 1px #34ff44;
}

.tile-wrapper.is-dragging.available {
  background-color: rgba(255,255,255,.1)!important;
}

.tile-wrapper.is-dragging.blocked {
  background-color: rgba(0,0,0,.4)!important;
  z-index: 10001;
}

.cover-tile {
  position: absolute;
  image-rendering: pixelated;
  z-index: 10000;
}

MCreature {
  position: absolute;
  image-rendering: pixelated;
  z-index: 10002;
}

.no-pointer {
  pointer-events: none;
}

</style>
