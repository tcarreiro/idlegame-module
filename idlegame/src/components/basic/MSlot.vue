<script setup lang="ts">
  import { useWorld } from '@/composable/World.composable';
  import type { TileModel } from '@/models/tile';
  import { computed, onMounted, ref } from 'vue';
  import { Sprite, AnimatedSprite, BaseTexture, Texture, Rectangle, FederatedPointerEvent } from 'pixi.js'
import { frameSize, spriteSize, tileSize } from '@/utils/constants';
import { useBorderDrawer } from '@/composable/BorderDrawer.composable';
import type { BeastModel } from '@/models/beast.model';
import type { ItemModel } from '@/models/item.model';

  const world = useWorld();
  const borderDrawer = useBorderDrawer();

  export type MSlotProps = {
    slotId:number,
    parentInventoryId:string,
    content:BeastModel|ItemModel,
  };

  const props = withDefaults(defineProps<MSlotProps>(), {
  });

  const padding = 10;

  const dragging = defineModel("dragging");
  const spriteAtlas = computed(()=>BaseTexture.from(`/sprites/slots/${props.content.spriteName}.png`));

  const textures = computed(()=> {
    const frameList:Array<Texture> = [];
    props.content.frameId.forEach((frame, index) => {
      frameList.push(new Texture(spriteAtlas.value, getFrameRect(props.content.frameId[index], frameSize, spriteSize)));
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

  const position = computed(() => {
    const perRow = 4;
    const x = props.slotId % perRow
    const y = Math.floor(props.slotId / perRow)
    return {x, y};
  });

  const emit = defineEmits(["onClick", "update:tile"]);

  const onClick = () => {
    emit("onClick", props.content);
  };

  const updateTile = (newTile: TileModel) => {
    emit("update:tile", newTile)
  }

const spriteRef = ref<AnimatedSprite>();

const dragData = {
  dragging: false,
  offsetX: 0,
  offsetY: 0,
};

const onDragStart = (event: FederatedPointerEvent) => {
  dragData.dragging = true;
  const sprite = spriteRef.value!;
  const position = event.data.getLocalPosition(sprite.parent);
  dragData.offsetX = position.x - sprite.x;
  dragData.offsetY = position.y - sprite.y;
  dragging.value = true;
};

const onDragMove = (event: FederatedPointerEvent) => {
  if (!dragData.dragging) return;
  const sprite = spriteRef.value!;
  const position = event.data.getLocalPosition(sprite.parent);
  sprite.x = position.x - dragData.offsetX;
  sprite.y = position.y - dragData.offsetY;
};

const onDragEnd = () => {
  dragData.dragging = false;
  dragging.value = false;
};

onMounted(() => {
  const sprite = spriteRef.value;
  if (!sprite) return;

  sprite.on('pointerdown', onDragStart);
  sprite.on('pointermove', onDragMove);
  sprite.on('pointerup', onDragEnd);
  sprite.on('pointerupoutside', onDragEnd);
});



</script>

<template>
  <AnimatedSprite
    :textures="textures"
    :anchor="0"
    :x="(padding + position.x*(world.spriteSize + padding))/world.scale"
    :y="(padding + position.y*(world.spriteSize + padding))/world.scale"
    :scale="2"
    :play="true"
    :animation-speed="0.05"
    @click="onClick()"
    ref="spriteRef"
  />
</template>
