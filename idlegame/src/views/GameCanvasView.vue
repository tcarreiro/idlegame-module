<script setup lang="ts">
  import SideHUDContainer from "@/components/SideHUDContainer.vue";
import WorldContainer from "@/components/WorldContainer.vue";
  import { useWorld } from "@/composable/World.composable";
  import { Texture, TilingSprite } from "pixi.js";
  import { onMounted, onUnmounted } from "vue";

  const world = useWorld();

  onMounted(()=>{
    window.addEventListener('resize', world.updateSize);
    world.updateSize();
  });

  onUnmounted(() => {
    window.removeEventListener("resize", world.updateSize);
  })

</script>

<template>
  <div style="position: absolute; top: 10px; left: 10px; z-index: 1000;">
    <input
      type="text"
      placeholder="Digite algo..."
      style="padding: 8px; border-radius: 4px; border: 1px solid #ccc;"
    />
  </div>

  <TilingSprite
    :texture="Texture.from(`/sprites/background/cross_stripes.png`)"
    :width="world.screenWidth.value"
    :height="world.screenHeight.value"
    alpha="0.9"
  />

  <WorldContainer />
  <SideHUDContainer />

</template>
