<script setup lang="ts">
import MWorldGrid from '@/components/baseContainer/MWorldGrid.vue';
import { useGameSocket } from '@/composable/gameSocket.composable';
import { useWorld } from '@/composable/world.composable';
import { onMounted, onUnmounted, ref, type Ref } from 'vue';

const world = useWorld();
const gameSocket = useGameSocket();
const gameId = 'global'

const messages:Ref<Array<string>> = ref<string[]>([]);

onMounted(() => {
  gameSocket.connect();
  world.updateWorld();
});

onUnmounted(() => {
  gameSocket.disconnect();
  world.stopWorld();
});

const sendStomp = () => {
  gameSocket.sendGameMessage("player-action", { content: "MSG" })
}

</script>

<template>
  <div class="main-container">
    <div class="top-hud">
      <button @click="sendStomp()">Stomp</button>
    </div>
    <div class="screen-container">
      <MWorldGrid />
    </div>
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
