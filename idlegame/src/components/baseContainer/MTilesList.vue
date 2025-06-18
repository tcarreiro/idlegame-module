<script setup lang="ts">
import { computed } from 'vue';
import MBorder from '../basic/MBorder.vue';
import MInput from '../forms/MInput.vue';
import { useWorld } from '@/composable/World.composable';
import { drawSize, getDrawFromAtlas, getRendererFrameId } from '@/utils/renderer';
import type { FrameDto } from '@/models/frame.model';
import { getEnumValueByKey } from '@/utils/functions';
import { SpriteGroup } from '@/utils/constants';

const world = useWorld();

type MTilesListProps = {
  frameDuration?: number,
};

const props = withDefaults(defineProps<MTilesListProps>(), {
  frameDuration: 200, // ms
});

const selectedFrame = defineModel<FrameDto|null>({required:true});
const frames = defineModel<Array<FrameDto>>("frames",{required:true});
const stageName = defineModel<string>("stageName",{required:true});

const frameIndex = computed(() => (index:number) => getRendererFrameId(world.localFrameTimer.value, props.frameDuration, frames.value[index].frameIndex.length));

const handleClick = (frame:FrameDto) => {
  // const newTile = new WorldTileDto();
  // newTile.
  // newTile.baseTile.frameId = [tileId];
  // newTile.baseTile.sprite.name = spritePath.value;
  // world.selectedTile.value = newTile;
  selectedFrame.value = frame;
};

const getFrame = computed(() => (index:number) => {
  const frame = frames.value[index];
  const sprite = frame.sprite;
  const size = world.TILE_CONFIG.tileWorldScale*sprite.frameSize;
  const atlasNumCols = sprite.width/sprite.frameSize;
  const frameNum = frame.frameIndex[frameIndex.value(index)];
  const col = frameNum % atlasNumCols;
  const row = Math.floor(frameNum / atlasNumCols);

  return {
    ...drawSize(size),
    ...getDrawFromAtlas(getEnumValueByKey(SpriteGroup, sprite.spriteGroup)!.toString(),sprite.name, atlasNumCols, size, col, row),
  };
});

</script>

<template>
  <MBorder inverted class="inventory-container">
    <MInput class="p-0 justify-content-center" style="width: 100%;height: 20px;" v-model="stageName"/>
    <div v-if="frames" class="overflow-y-scroll scroll-custom slots-container" style="height: 462px;">
      <div v-for="(frame, index) in frames" class="tile p-3 pb-0 flex justify-content-between" :class="{ 'selected': selectedFrame===frame }" @click="handleClick(frame)">
        <div class="option" :style="getFrame(index)"></div>
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

.tile{
  image-rendering: pixelated;
  box-shadow: inset 0 0 0 1px transparent;
}

.option {
  cursor: pointer;
  background-color: transparent;
}

.tile:hover {
  box-shadow: inset 0 0 0 1px #34ff44;
}

.selected {
  background-color: rgba(50,50,255,0.6);
  box-shadow: inset 0 0 0 1px #34ff44;
}

.slots-container {
  align-items: start;
  align-content: start;
  background-repeat: no-repeat;
  background-position: left;
}

</style>
