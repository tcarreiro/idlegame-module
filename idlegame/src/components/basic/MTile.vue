<script setup lang="ts">
  import { useWorld } from '@/composable/World.composable';
  import type { TileModel } from '@/models/tile';
  import { computed } from 'vue';
  import { Sprite, AnimatedSprite, BaseTexture, Texture, Rectangle } from 'pixi.js'
import { frameSize, spriteSize, tileSize } from '@/utils/constants';

  const world = useWorld();

  export type WorldTileProps = {
    tile: TileModel;
  };

  const props = withDefaults(defineProps<WorldTileProps>(), {
  });

  const spriteAtlas = computed(()=>BaseTexture.from(`/sprites/tiles/${props.tile.spriteName}.png`));

  const textures = computed(()=> {
    const frameList:Array<Texture> = [];
    props.tile.frameId.forEach((frame, index) => {
      frameList.push(new Texture(spriteAtlas.value, getFrameRect(props.tile.frameId[index], frameSize, spriteSize)));
    });
    return frameList;
  });


  const getFrameRect = (id: number, size: number, sheetWidth: number): Rectangle => {
    const perRow = sheetWidth / size
    const x = id % perRow
    const y = Math.floor(id / perRow)
    const rect = new Rectangle()
    rect.x = x * size;
    rect.y = y * size;
    rect.width = size;
    rect.height = size;
    return rect
  }

  const emit = defineEmits(["onClick", "update:tile"]);

  const onClick = () => {
    emit("onClick", props.tile);
  };

  const updateTile = (newTile: TileModel) => {
    emit("update:tile", newTile)
  }


</script>

<template>
  <AnimatedSprite
    :textures="textures"
    :anchor="0"
    :x="tile.x*world.spriteSize/world.scale"
    :y="tile.y*world.spriteSize/world.scale"
    :scale="world.scale"
    :play="true"
    :animation-speed="0.05"
    @click="onClick()"
  />
</template>
