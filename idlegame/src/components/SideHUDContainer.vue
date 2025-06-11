<script setup lang="ts">
  import {  onMounted } from "vue";
  import MContainer from "./basic/MContainer.vue";
  import { useWorld } from "@/composable/World.composable";
  import BestiaryHUDContainer from "@/components/BestiaryHUDContainer.vue";
  import UserHUDContainer from "./UserHUDContainer.vue";

  const world = useWorld();

  onMounted(() => {
  });

</script>

<template>
  <MContainer v-model="world.sideHudRect.value">
    <UserHUDContainer />
    <BestiaryHUDContainer />
  </MContainer>
</template>
