<script setup lang="ts">
  import { Texture } from "pixi.js";
  import {  onMounted, ref, type Ref } from "vue";
  import MContainer from "./basic/MContainer.vue";
  import type { TileModel } from "@/models/tile";
  import { useWorld } from "@/composable/World.composable";
  import { fetchWorldMap } from "@/services/world-map.service";
  import MTile from "./basic/MTile.vue";

  const world = useWorld();

  const tiles:Ref<Array<TileModel>> = ref([]);
  const loadingMap:Ref<boolean> = ref(false);

  const getWorldData = async () => {
    try {
      loadingMap.value = true;
      tiles.value = await fetchWorldMap();
    } catch (error) {
      console.error(error);
    } finally {
      loadingMap.value = false;
    }
  };

  onMounted(() => {
    getWorldData();
  });

</script>

<template>
  <MContainer v-model="world.mainContainerRect.value" :border="'doubleBeveled'" :backgroundTexture="Texture.from(`/sprites/background/noise.png`)">
    <MContainer v-model="world.mapScreenRect.value" :border="'simple'">
      <MTile v-for="(tile, index) in tiles" :key="index"
        :tile="tile"
        @update:tile="(val:TileModel) => tiles[index] = val"
      />
    </MContainer>
  </MContainer>
</template>
