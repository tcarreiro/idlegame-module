<script setup lang="ts">
import MInventory from '@/components/baseContainer/MInventory.vue';
import MProfile from '@/components/baseContainer/MProfile.vue';
import MWorldGrid from '@/components/baseContainer/MWorldGrid.vue';
import MBorder from '@/components/basic/MBorder.vue';
import MButton from '@/components/basic/MButton.vue';
import { useEntities } from '@/composable/entity.composable';
import { useGameSocket } from '@/composable/gameSocket.composable';
import { Entity } from '@/models/entity.model';
import { EntitySize, EntityState, Orientation } from '@/utils/constants';
import { computed, onBeforeMount, onMounted, onUnmounted, ref, type Ref } from 'vue';

const {connect, disconnect, world} = useGameSocket();
const creatures = useEntities();

const createTeam = () => {
  const bestiarySlots:Ref<Array<Entity>> = ref(
    Array.from({ length: 6 }, (o, i) => {
      const model = new Entity();
      model.id = "id" + i;
      model.name = "orcspearman";
      model.renderData.entityState = EntityState.IDLE;
      model.renderData.slotFrameId = [0];
      model.renderData.worldFrameId = [0, 1, 2, 3, 4, 5, 6, 7];
      model.renderData.orientation = Orientation.SOUTH;
      return model;
    })
  );

  bestiarySlots.value[1].name="minotaurguard";
  bestiarySlots.value[2].name="minotaur";
  bestiarySlots.value[3].name="deer";
  bestiarySlots.value[3].renderData.entitySizeConfig=EntitySize.BIG;
  bestiarySlots.value[3].renderData.slotOffset={x:30, y:35, z:0};
  bestiarySlots.value[4].name="dragonlord";
  bestiarySlots.value[4].renderData.entitySizeConfig=EntitySize.BIG;
  bestiarySlots.value[4].renderData.slotOffset={x:0, y:20, z:0};

  creatures.setEntityTeam(bestiarySlots.value);
};

onBeforeMount(() => {
  createTeam();  
});

onMounted(() => {
  connect();
});

onUnmounted(() => {
  disconnect();
});

</script>

<template>
  <div class="main-content cross-container">
    <div class="content-wrapper">
      <MBorder class="noise-container mr-5" thickness="thick">
        <MWorldGrid class="m-3"/>
      </MBorder>
      <div class="flex-column" style="width: 184px;">
        <MBorder class="noise-container mb-5" inverted>
          <MProfile v-model="creatures.entitiesOnTeam.value[0]" style="height: 40px;"/>
        </MBorder>
        <MBorder class="noise-container mb-5 flex-grow-1" thickness="thick">
          <div class="flex justify-content-center">Bestiário ({{ creatures.entitiesOnTeam.value.length }}/{{ 100 }})</div>
          <MInventory v-model="creatures.entitiesOnTeam.value"/>
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
