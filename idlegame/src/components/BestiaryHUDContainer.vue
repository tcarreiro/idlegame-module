<script setup lang="ts">
import { Rectangle, Sprite, Texture } from "pixi.js";
import {  computed, onMounted, ref, type Ref } from "vue";
import MContainer from "./basic/MContainer.vue";
import { useWorld } from "@/composable/World.composable";
import BaseInput from "./basic/BaseInput.vue";
import MInventory from "./basic/MInventory.vue";

  const world = useWorld();

  const beastNameSearch:Ref<string> = ref("");

  const inputRect = computed(()=>{
    const rect = new Rectangle();
    rect.x = world.sideHudRect.value.x+3;
    rect.y = world.sideHudRect.value.y+world.bestiaryDataRect.value.y;
    rect.width = world.bestiaryDataRect.value.width-6;
    rect.height = 20;
    return rect;
  });

  onMounted(() => {
  });

</script>

<template>
  <MContainer v-model="world.bestiaryDataRect.value" :border="'doubleBeveled'" :backgroundTexture="Texture.from(`/sprites/background/noise.png`)">
    <MInventory/>
    <!-- <BaseInput
      v-model="beastNameSearch"
      placeholder="Buscar"
      :backgroundTexture="Texture.from(`/sprites/background/noise.png`)"
      :inputRect="inputRect"
      @update:model-value="val => console.log(val)"
    /> -->
    <!-- <MButton
      :texture="[Texture.from(`/sprites/tiles/grass1.png`)]"
      @onClick="handleClick()"
      :y="world.bestiaryDataRect.value.y+25"
    /> -->
  </MContainer>
</template>
