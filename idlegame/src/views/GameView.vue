<script setup lang="ts">
import MInventory from '@/components/baseContainer/MInventory.vue';
import MProfile from '@/components/baseContainer/MProfile.vue';
import MWorldGrid from '@/components/baseContainer/MWorldGrid.vue';
import MBorder from '@/components/basic/MBorder.vue';
import MButton from '@/components/forms/MButton.vue';
import { useGameSocket } from '@/composable/gameSocket.composable';
import type { WorldTileDto } from '@/models/tile.model';
import { fetchWorldMap, startBattle } from '@/services/world-map.service';
import { onBeforeMount, onMounted, onUnmounted, ref, type Ref } from 'vue';
import type { CreatureDto } from '@/models/creature.model';
import { fetchUserTeam } from '@/services/creatures.service';
import { useCreatures } from '@/composable/creatures.composable';

const {connect, disconnect, world, subscribeToBattleChannel} = useGameSocket();
const creatures = useCreatures();
const loadingMap:Ref<boolean> = ref(false);
const loadingTeam:Ref<boolean> = ref(false);

const getWorldData = async () => {
  const tiles:Ref<Array<WorldTileDto>> = ref([]);
  try {
    loadingMap.value = true;
    tiles.value = await fetchWorldMap();
    world.setWorldTiles(tiles.value);
  } catch (error) {
    console.error(error);
  } finally {
    loadingMap.value = false;
  }
};

const getUserTeam = async () => {
  const bestiarySlots:Ref<Array<CreatureDto>> = ref([]);
  try {
    loadingTeam.value = true;
    bestiarySlots.value = await fetchUserTeam();
    creatures.setCreatureTeam(bestiarySlots.value);
  } catch (error) {
    console.error(error);
  } finally {
    loadingTeam.value = false;
  }
}

onBeforeMount(() => {
  getWorldData();
  getUserTeam();
});

onMounted(() => {
  world.isCreatingWorld.value = false;
  connect();
});

onUnmounted(() => {
  disconnect();
});

const startBattleService = async () => {
  await startBattle();
  world.setWorldState(true);
}

</script>

<template>
  <div class="main-content cross-container">
    <div class="content-wrapper">
      <MBorder class="noise-container mr-5" thickness="thick">
        <MWorldGrid class="m-3"/>
      </MBorder>
      <div class="flex-column" style="width: 184px;">
        <MBorder class="noise-container mb-5" inverted>
          <MProfile v-if="creatures.creaturesOnTeam.value.length" v-model="creatures.creaturesOnTeam.value[0]" style="height: 40px;"/>
        </MBorder>
        <MBorder class="noise-container mb-5 flex-grow-1" thickness="thick">
          <div class="flex justify-content-center no-select">Bestiário ({{ creatures.creaturesOnTeam.value.length }}/{{ 100 }})</div>
          <MInventory v-if="creatures.creaturesOnTeam.value.length" v-model="creatures.creaturesOnTeam.value"/>
        </MBorder>
        <div>
          <MButton secondary class="w-full mb-5" style="height:30px" label="Selecionar Mapa"/>
        </div>
        <div>
          <MButton :disabled="world.isRunning.value || !creatures.creaturesOnField.value.length" class="w-full" style="height:60px" label="INICIAR" @click="startBattleService()"/>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.main-content {
  background-color: rgba(0,0,0,0.8);
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}

.content-wrapper {
  display: flex;
  margin-top: 2rem;
}

@media (max-width: 1200px) {
  .content-wrapper {
    display: flex;
    flex-direction: column;
    margin-top: 2rem;
  }
}

</style>
