<script setup lang="ts">
import MCreateWorldGrid from '@/components/baseContainer/MCreateWorldGrid.vue';
import MTilesList from '@/components/baseContainer/MTilesList.vue';
import MBorder from '@/components/basic/MBorder.vue';
import MButton from '@/components/forms/MButton.vue';
import MDropDown, { type MDropDownGroup, type MDropDownItem } from '@/components/forms/MDropDown.vue';
import { useWorld } from '@/composable/World.composable';
import type { Tile } from '@/models/tile.model';
import { fetchWorldMap } from '@/services/world-map.service';
import { dropdownDefaultOption } from '@/utils/constants';
import { computed, onBeforeMount, onMounted, onUnmounted, ref, type Ref } from 'vue';

const world = useWorld();

const tileTypeOptions:Ref<Array<MDropDownItem>> = ref([]);
const tileType:Ref<MDropDownItem> = ref(dropdownDefaultOption);
const tileTypeName = computed(()=>tileType.value?.value.toString()??"");
const spriteSetOptions:Ref<Array<MDropDownGroup>> = ref([]);
const spriteSet:Ref<MDropDownItem> = ref(dropdownDefaultOption);
const spriteSetName = computed(()=>spriteSet.value?.value.toString()??"");
const loadingMap:Ref<boolean> = ref(false);
const selectedTileId:Ref<number> = ref(-1);

const getWorldData = async () => {
  const tiles:Ref<Array<Tile>> = ref([]);
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

const getTiles = () => {
  tileTypeOptions.value =[
    dropdownDefaultOption,
    { label: 'Tile', value: "baseTile" },
    { label: 'Prop', value: "coverTile" },
  ];
};

const getCoverTiles = () => {
  spriteSetOptions.value = [
    {
      label: 'Cave',
      category: 'baseTile',
      items: [
        { label: 'caveDirt1', value: "caveDirt1" },
        { label: 'caveDirt2', value: "caveDirt2" },
        { label: 'caveDirt3', value: "caveDirt3" },
        { label: 'caveDirt4', value: "caveDirt4" },
        { label: 'caveDirt5', value: "caveDirt5" },
      ]
    },
    {
      label: 'Cave',
      category: 'coverTile',
      items: [
        { label: 'caveCeiling1', value: "caveCeiling1" },
        { label: 'caveCeilingCorners', value: "caveCeilingCorners" },
      ]
    },
  ];
};

onBeforeMount(() => {
  getWorldData();
  getTiles();
  getCoverTiles();
});

</script>

<template>
  <div class="main-content cross-container">
    <div v-if="!loadingMap" class="content-wrapper">
      <MBorder class="noise-container mr-5" thickness="thick">
        <MCreateWorldGrid v-model="selectedTileId" class="m-3"/>
      </MBorder>
      <div class="flex-column" style="width: 184px;">
        <MBorder class="noise-container mb-5" inverted>
           <MDropDown class="m-2" v-model="tileType" :options="tileTypeOptions" />
           <MDropDown class="m-2 mt-0" :disabled="!tileTypeName" v-model="spriteSet" :options="spriteSetOptions.filter(opt=>opt.category===tileType.value)" type="group" placeholder="Selecione"/>
        </MBorder>
        <MBorder class="noise-container mb-5 flex-grow-1" thickness="thick">
          <MTilesList v-model="selectedTileId" v-model:type="tileTypeName" v-model:sprite="spriteSetName"/>
        </MBorder>
        <div>
          <MButton accent disabled class="w-full mb-5" style="height:30px" label="Carregar JSON"/>
        </div>
        <div>
          <MButton class="w-full" style="height:30px" label="Gerar JSON"/>
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
