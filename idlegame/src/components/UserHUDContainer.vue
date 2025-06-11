<script setup lang="ts">
import { Texture } from "pixi.js";
import {  onMounted } from "vue";
import MContainer from "./basic/MContainer.vue";
import { useWorld } from "@/composable/World.composable";

  const world = useWorld();

  onMounted(() => {
  });

</script>

<template>
  <MContainer v-model="world.userDataRect.value" :border="'simple-inverted'" :backgroundTexture="Texture.from(`/sprites/background/noise.png`)">
  </MContainer>
</template>
