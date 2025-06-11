<script setup lang="ts">
import { AnimatedSprite, Sprite, type Texture } from 'pixi.js';
import { ref, type Ref } from 'vue';

type AnimationTrigger = "none"|"always"|"hover"|"click"

type MButtonProps = {
  texture: Texture[];
  x?: number;
  y?: number;
  scale?: number;
  animationTrigger?: AnimationTrigger;
};

const props = withDefaults(defineProps<MButtonProps>(), {
  x:0,
  y:0,
  scale:1,
  animationTrigger:"none",
});

const emit = defineEmits(["onClick","hoverOn","hoverOut"]);

const isHovered:Ref<Boolean> = ref(false);

</script>

<template>
  <AnimatedSprite
    :textures="props.texture"
    :x="props.x"
    :y="props.y"
    :scale="props.scale"
    :play="isHovered"
    :animation-speed="0.05"
    @pointertap="() => emit('onClick')"
    @pointerover="() => (isHovered = true)"
    @pointerout="() => (isHovered = false)"
  />
</template>
