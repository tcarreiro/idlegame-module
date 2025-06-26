<script setup lang="ts">
import { useWorld } from "@/composable/World.composable";
import type { WorldTileDto } from '@/models/tile.model';
import { computed, ref, type Ref } from 'vue';
import { useCreatures } from '@/composable/creatures.composable';
import { drawSize, getDrawFromAtlas, getRendererFrameId } from '@/utils/renderer';

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

const onDragEnter = (event: DragEvent) => {
  if (!event.target) return;
  isHovering.value = true;
};

const onDragLeave = (event: DragEvent) => {
  isHovering.value = false;
};

const onDragOver = (event: DragEvent) => {
  event.dataTransfer!.dropEffect = 'move';
};

const onDrop = (event:DragEvent) => {
  isHovering.value = false;
  if (!event.dataTransfer) return;
  if (enablePlaceCreature.value) {
    world.addCreatureOnTile(creatures.creatureBeingDrag.value!, props.tile);
  }
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
  <!-- ${!props.tile.isBlocked()?'available':'blocked'} -->
  <div
    :class="`
      tile-wrapper
      ${world.isCreatingWorld.value?'border':''}
      ${isHovering?'is-hovering':''}
      ${creatures.creatureBeingDrag.value?'is-dragging':''}
      ${props.tile.presentCreature?'occupied':''}
      ${!props.tile.isBlocked()?'available':''}
      ${(props.tile.position.x+props.tile.position.y)%2===0 ? 'light': 'dark'}
    `"
    @click="emit('click', props.tile)"
    @contextmenu.prevent="emit('contextClick', props.tile)"
    :style="getBaseTileFrame"
    @dragover.prevent="onDragOver"
    @drop="onDrop"
    @dragenter.self="onDragEnter"
    @dragleave.self="onDragLeave"
    >
    <div
      v-for="(ct, index) in props.tile.tileCover"
      :class="`
        cover-tile
        ${world.isCreatingWorld.value?'border':''}
        ${shouldIgnorePointerEvents?'no-pointer-events':''}
        ${creatures.creatureBeingDrag.value?'is-dragging':''}
      `"
      :style="getCoverTileFrame(index)"
    ></div>
    <div v-if="props.tile.isBlocked() && creatures.creatureBeingDrag.value" class="blocked"></div>
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
.tile-wrapper.is-hovering.available {
  box-shadow: inset 0 0 0 1px #34ff44;
}

.tile-wrapper.is-dragging.available.light {
  background-color: rgba(255,255,255,.08)!important;
}

.tile-wrapper.is-dragging.available.dark {
  background-color: rgba(255,255,255,.13)!important;
}

.blocked {
  position: inherit;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,.4)!important;
  z-index: 10001;
}

.cover-tile {
  position: absolute;
  image-rendering: pixelated;
  z-index: 10000;
}

</style>
