<script setup lang="ts">
import { computed, ref, watch, type Ref } from 'vue';
import MBorder from '../basic/MBorder.vue';
import MInput from '../forms/MInput.vue';
import {  Tile, type TileRenderData } from '@/models/tile.model';
import { useEntities } from '@/composable/entity.composable';
import { useWorld } from '@/composable/World.composable';
import { drawSize, getDrawFromAtlas } from '@/utils/renderer';

const world = useWorld();

const selectedId = defineModel<number>({required:true});
const type = defineModel<string>("type",{required:true});
const sprite = defineModel<string>("sprite",{required:true});
const spritePath = computed(()=>`${type.value}/${sprite.value}`);
const tiles = ref();


watch(spritePath, async (newVal) => {
  try {
    const frameSize = world.TILE_CONFIG.tileAtlasSize;
    const response = await getImageSize(newVal);
    tiles.value = response.width/frameSize*response.height/frameSize;
  } catch (error) {
    tiles.value = null;
  }
});

const handleClick = (tileId:number) => {
  const newTile = new Tile();
  newTile.baseTile.frameId = [tileId];
  newTile.baseTile.spriteName = spritePath.value;
  world.selectedTile.value = newTile;
  selectedId.value = tileId;
};

// const frameIndex = computed(() => {
//   return getRendererFrameId(world.localFrameTimer.value, props.frameDuration, props.entity.renderData.slotFrameId.length);
// });

const getImageSize = (src: string): Promise<{ width: number; height: number }> => {
  const path = `/sprites/tiles/${src}.png`;
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.width, height: img.height });
    img.onerror = reject;
    img.src = path;
  });
}

const getFrame = computed(() => (index:number) => {
  const sizeConfig = world.TILE_CONFIG;
  let size = sizeConfig.tileWorldSize;

  const atlasNumCols = sizeConfig.atlasNumCols;
  const col = index % atlasNumCols;
  const row = Math.floor(index / atlasNumCols);

  return {
    ...drawSize(size),
    ...getDrawFromAtlas("tiles",`${spritePath.value}`, atlasNumCols, size, col, row),
  };
});

</script>

<template>
  <MBorder inverted class="inventory-container">
    <MInput class="p-0 justify-content-center" style="width: 100%;height: 20px;"/>
    <div v-if="tiles" class="overflow-y-scroll scroll-custom slots-container" style="height: 462px;">
      <div v-for="(tile, index) in tiles" class="p-3 pb-0 flex justify-content-between" :class="{ 'selected': selectedId===index }" @click="handleClick(index)">
        <div class="option" :style="getFrame(index)">
        </div>
        {{index}}
      </div>
    </div>
  </MBorder>
</template>

<style scoped>
.inventory-container{
  margin:2px;
  display: flex;
  justify-content: center;
}

.option {
  cursor: pointer;
  background-color: transparent;
}

.selected {
  background-color: rgba(50,50,255,0.6);
}

.slots-container {
  align-items: start;
  align-content: start;
  background-repeat: no-repeat;
  background-position: left; /* centraliza a imagem */
}

</style>
