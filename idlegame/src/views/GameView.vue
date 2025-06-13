<script setup lang="ts">
import MInventory from '@/components/baseContainer/MInventory.vue';
import MProfile from '@/components/baseContainer/MProfile.vue';
import MWorldGrid from '@/components/baseContainer/MWorldGrid.vue';
import MBorder from '@/components/basic/MBorder.vue';
import MButton from '@/components/basic/MButton.vue';
import { useCreatures } from '@/composable/entity.composable';
import { useGameSocket } from '@/composable/gameSocket.composable';
import { EntityModel } from '@/models/entity.model';
import { EntitySize, EntityState, Orientation } from '@/utils/constants';
import { computed, onMounted, onUnmounted, ref, type Ref } from 'vue';

const {connect, disconnect, world} = useGameSocket();
const creatures = useCreatures();

const bestiarySlots:Ref<Array<EntityModel>> = ref(
  Array.from({ length: 6 }, (o, i) => {
    const model = new EntityModel();
    model.entity.id = "id" + i;
    model.entity.name = "orcspearman";
    model.entityState = EntityState.IDLE;
    model.slotFrameId = [0];
    model.frameId = [0, 1, 2, 3, 4, 5, 6, 7];
    model.orientation = Orientation.SOUTH;
    return model;
  })
);

bestiarySlots.value[1].entity.name="minotaurguard";
bestiarySlots.value[2].entity.name="minotaur";
bestiarySlots.value[3].entity.name="deer";
bestiarySlots.value[3].entitySize=EntitySize.BIG;
bestiarySlots.value[3].slotOffset={x:64, y:90, z:0};
bestiarySlots.value[4].entity.name="dragonlord";
bestiarySlots.value[4].entitySize=EntitySize.BIG;
bestiarySlots.value[4].slotOffset={x:14, y:70, z:0};

onMounted(() => {
  connect();
});

onUnmounted(() => {
  disconnect();
});

const sendStomp = () => {
  // sendGameMessage("player-action", { content: "MSG" });
  world.setWorldState(!world.isRunning.value);
}

const onField = computed(()=>creatures.entitiesOnFieldRef);

</script>

<template>
  <div class="main-content cross-container">
    <div class="content-wrapper">
      <MBorder class="noise-container mr-5" thickness="thick">
        <MWorldGrid class="m-3"/>
      </MBorder>
      <div class="flex-column" style="width: 184px;">
        <MBorder class="noise-container mb-5" inverted>
          <MProfile v-model="bestiarySlots[0]" style="height: 40px;"/>
        </MBorder>
        <MBorder class="noise-container mb-5 flex-grow-1" thickness="thick">
          <div class="flex justify-content-center">Bestiário ({{ bestiarySlots.length }}/{{ 100 }})</div>
          <MInventory v-model="bestiarySlots"/>
        </MBorder>
        <div>
          <MButton secondary class="w-full mb-5" style="height:30px" label="Selecionar Mapa"/>
        </div>
        <div>
          <MButton class="w-full" style="height:60px" label="INICIAR"/>
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
