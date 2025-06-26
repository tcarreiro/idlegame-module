<script setup lang="ts">
import { useWorld } from "@/composable/World.composable";
import type { WorldTileDto } from '@/models/tile.model';
import { computed, ref, type Ref } from 'vue';
import MCreature from './MCreature.vue';
import { useCreatures } from '@/composable/creatures.composable';
import { drawSize, getDrawFromAtlas, getRendererFrameId } from '@/utils/renderer';
import { EntityState, Orientation } from "@/utils/constants";

const world = useWorld();
const creatures = useCreatures();

type MTileProps = {
  tile: WorldTileDto,
  frameDuration?: number,
};

const props = withDefaults(defineProps<MTileProps>(), {
  frameDuration: 200, // ms
});

const emit = defineEmits(["click", "contextClick"]);

const isHovering:Ref<boolean> = ref(false);

const creatureRef = computed(()=> creatures.getCreatureOnField(props.tile.presentCreature??-1));
const enablePlaceCreature = computed(()=>!props.tile.isBlocked() && creatures.creatureBeingDrag.value);
const baseTileFrameIndex = computed(() => getRendererFrameId(world.localFrameTimer.value, props.frameDuration, props.tile.baseTile.frameId.length));
const coverTileFrameIndex = computed(() => (index:number) => getRendererFrameId(world.localFrameTimer.value, props.frameDuration, props.tile.tileCover[index].frameId.length));
const shouldIgnorePointerEvents = computed(() => !!creatures.creatureBeingDrag.value);

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
  if (!props.tile || !creatureRef.value) return;
  creatureRef.value.baseCreature.renderData.entityState = EntityState.IDLE;
  creatureRef.value.baseCreature.renderData.orientation = Orientation.SOUTH;
  const size = creatureRef.value.baseCreature.renderData.sprite.frameSize * world.TILE_CONFIG.tileWorldScale;
  const atlasNumCols = creatureRef.value.baseCreature.renderData.sprite.width/creatureRef.value.baseCreature.renderData.sprite.frameSize;
  const col = creatureRef.value.baseCreature.renderData.orientation;
  const row = creatureRef.value.baseCreature.renderData.frameIndex[baseTileFrameIndex.value];
  const offset = size - world.TILE_CONFIG.tileWorldSize;

  return {
    ...drawSize(size),
    ...getDrawFromAtlas("creature",`${creatureRef.value.baseCreature.name}_${creatureRef.value.baseCreature.renderData.entityState}`, atlasNumCols, size, col, row),
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
    world.addCreatureOnTile(creatures.creatureBeingDrag.value!, props.tile);
  }
}

const onDragStart = (event:DragEvent) => {
  if (!event.dataTransfer || !creatureRef.value) return;

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

  creatures.setDraggingCreature(creatureRef.value);
}

const onDragEnd = (event: DragEvent) => {
  creatures.setDraggingCreature(null);
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
      ${creatures.creatureBeingDrag.value?'is-dragging':''}
      ${!props.tile.isBlocked()?'available':'blocked'}
      ${props.tile.presentCreature?'occupied':''}
    `"
    @click="emit('click', props.tile)"
    @contextmenu.prevent="emit('contextClick', props.tile)"
    :style="getBaseTileFrame"
    :draggable="!!props.tile.presentCreature"
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
        'is-dragging': creatures.creatureBeingDrag.value,
        'available': !props.tile.isBlocked(),
        'blocked': props.tile.isBlocked()
      }"
      :style="getCoverTileFrame(index)"
    ></div>
    <MCreature v-if="creatureRef" class="creature" :creature="creatureRef" :class="{ 'no-pointer': shouldIgnorePointerEvents }"/>
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

MCreature,
.creature {
  position: absolute;
  image-rendering: pixelated;
  z-index: 10002;
}

.no-pointer {
  pointer-events: none;
}

</style>
