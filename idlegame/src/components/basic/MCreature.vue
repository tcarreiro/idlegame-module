<script setup lang="ts">
import { useCreatures } from '@/composable/creatures.composable';
import { useWorld } from "@/composable/World.composable";
import type { CreatureDto } from '@/models/creature.model';
import { EntityState } from '@/utils/constants';
import { calculateMoveDuration } from '@/utils/functions';
import { drawSize, getDrawFromAtlas, getRendererFrameId } from '@/utils/renderer';
import { computed, onMounted, ref, type Ref } from 'vue';

///////
/////// OnField Entity Component
///////

const world = useWorld();
const creatures = useCreatures();

type MCreatureProps = {
  creature: CreatureDto,
  size?:number,
  frameDuration?: number,
};

const props = withDefaults(defineProps<MCreatureProps>(), {
  frameDuration: 120, // ms
});

const emit = defineEmits(["click"]);

const creatureRef:Ref<HTMLElement|null> = ref(null);

const shouldIgnorePointerEvents = computed(() => {
  const beingDragged = creatures.creatureBeingDrag.value;
  return beingDragged !== null && beingDragged.id !== props.creature.id;
});

const frameIndex = computed(() => {
  if (!props.creature) return 0;
  return getRendererFrameId(world.localFrameTimer.value, props.frameDuration, props.creature.baseCreature.renderData.frameIndex.length);
});

const getFrame = computed(() => {
  if (!props.creature) return;

  let size = props.size;
  if (!size) size = props.creature.baseCreature.renderData.sprite.frameSize * world.TILE_CONFIG.tileWorldScale;

  const col = props.creature.baseCreature.renderData.orientation;
  const row = props.creature.baseCreature.renderData.frameIndex[frameIndex.value];
  const offset = size - world.TILE_CONFIG.tileWorldSize;
  const atlasNumCols = props.creature.baseCreature.renderData.sprite.width/props.creature.baseCreature.renderData.sprite.frameSize;

  const speed = props.creature.stats.baseSpeed + props.creature.stats.modSpeed;
  const duration = calculateMoveDuration(1*64,speed);

  return {
    ...drawSize(size),
    ...getDrawFromAtlas("creature",`${props.creature.baseCreature.name}_${props.creature.baseCreature.renderData.entityState}`, atlasNumCols, size, col, row),
    transform: `translate(${-offset + props.creature.baseCreature.renderData.position.x * world.TILE_CONFIG.tileWorldSize}px,
                          ${-offset + props.creature.baseCreature.renderData.position.y * world.TILE_CONFIG.tileWorldSize}px)`,
    transition: `transform ${duration}ms linear`
  };
});

const onDragStart = (event:DragEvent) => {
  if (!event.dataTransfer) return;

  // Create preview
  const dragPreview = document.createElement('div');

  const creatureStyle = getFrame.value;
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

  // remove preview
  setTimeout(() => {
    document.body.removeChild(dragPreview);
  }, 0);

  creatures.setDraggingCreature(props.creature);
}

const onDragEnd = (event: DragEvent) => {
  creatures.setDraggingCreature(null);
}

onMounted(()=>{
  creatureRef.value?.addEventListener('transitionend', (event: TransitionEvent) => {
    if (event.propertyName === 'transform') {
      props.creature.baseCreature.renderData.entityState = EntityState.IDLE;
    }
  });
});

</script>

<template>
  <div
    class="creature-wrapper"
    :class="{ 'no-pointer-events': shouldIgnorePointerEvents }"
    :style="getFrame"
    @click="emit('click', props.creature)"
    :draggable="true"
    @dragstart="onDragStart"
    @dragend="onDragEnd"
    ref="creatureRef"
  >
  </div>
</template>

<style>
  .creature-wrapper {
    image-rendering: pixelated;
  }
</style>
