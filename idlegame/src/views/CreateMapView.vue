<script setup lang="ts">
import MCreateWorldGrid from '@/components/baseContainer/MCreateWorldGrid.vue';
import MTilesList from '@/components/baseContainer/MTilesList.vue';
import MWorldGrid from '@/components/baseContainer/MWorldGrid.vue';
import MBorder from '@/components/basic/MBorder.vue';
import MModal from '@/components/basic/MModal.vue';
import MStageList from '@/components/CreateMap/MStageList.vue';
import MButton from '@/components/forms/MButton.vue';
import MDropDown, { type MDropDownGroup, type MDropDownItem } from '@/components/forms/MDropDown.vue';
import { useGameSocket } from '@/composable/gameSocket.composable';
import { useWorld } from '@/composable/World.composable';
import { FrameDto } from '@/models/frame.model';
import { TileDto, type WorldTileDto } from '@/models/tile.model';
import { fetchAvailableStages, fetchFramesByGroupAndName, fetchWorldMap, saveStageService } from '@/services/world-map.service';
import { dropdownDefaultOption, SpriteGroup } from '@/utils/constants';
import { getEnumKeyByValue, getEnumValueByKey } from '@/utils/functions';
import { computed, onBeforeMount, onMounted, onUnmounted, ref, type Ref } from 'vue';

const {connect, disconnect, world} = useGameSocket();

const tileTypeOptions:Ref<Array<MDropDownItem>> = ref([]);
const tileType:Ref<MDropDownItem> = ref(dropdownDefaultOption);
const tileTypeName = computed(()=>tileType.value?.value?.toString()??"");
const spriteSetOptions:Ref<Array<MDropDownGroup>> = ref([]);
const spriteSet:Ref<MDropDownItem> = ref(dropdownDefaultOption);
const spriteSetName = computed(()=>spriteSet.value?.value?.toString()??"");
const loadingMap:Ref<boolean> = ref(false);
const loadingFrames:Ref<boolean> = ref(false);
const savingStage:Ref<boolean> = ref(false);
const stageName:Ref<string> = ref("");
const selectedFrame:Ref<FrameDto|null> = ref(null);

const frames:Ref<Array<FrameDto>> = ref([]);

const showModal: Ref<boolean> = ref(false);
const availableStages: Ref<Array<string>> = ref([]);
const choosenStage: Ref<string> = ref("");
const loadingStageOptions:Ref<boolean> = ref(false);

const getAvailableFrames = async () => {
  try {
    loadingFrames.value = true;
    frames.value = await fetchFramesByGroupAndName(tileTypeName.value, spriteSetName.value);
  } catch (error) {
    console.error(error);
  } finally {
    loadingFrames.value = false;
  }
};

// MOCK
const getTiles = () => {
  tileTypeOptions.value =[
    dropdownDefaultOption,
    { label: 'Tile', value: getEnumKeyByValue(SpriteGroup, SpriteGroup.BASE_TILE)?.toString() },
    { label: 'Prop', value: getEnumKeyByValue(SpriteGroup, SpriteGroup.COVER_TILE)?.toString() },
    { label: 'Creature', value: getEnumKeyByValue(SpriteGroup, SpriteGroup.CREATURE)?.toString() },
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
      label: 'Water',
      category: 'baseTile',
      items: [
        { label: 'waterDeep1', value: "waterDeep1" },
        { label: 'waterDeep2', value: "waterDeep2" },
      ]
    },
    {
      label: 'Cave',
      category: 'coverTile',
      items: [
        { label: 'caveCeiling1', value: "caveCeiling1" },
        { label: 'caveCeilingCorners1', value: "caveCeilingCorners1" },
      ]
    },
    {
      label: 'Water',
      category: 'coverTile',
      items: [
        { label: 'waterStraight1', value: "waterStraight1" },
        { label: 'waterCorners1', value: "waterCorners1" },
      ]
    },
    {
      label: 'Creature',
      category: 'creature',
      items: [
        { label: 'minotaur', value: "minotaur" },
      ]
    },
  ];
};

// Services
const saveStage = async () => {
  if (!stageName.value) return;
  try {
    savingStage.value = true;
    const tileDtoList:Array<TileDto> = [];
    world.worldTiles.value.forEach((wt) => {
      tileDtoList.push(new TileDto(wt))
    });
    await saveStageService(stageName.value, tileDtoList);
  } catch (error) {
    console.error(error);
  } finally {
    savingStage.value = false;
  }
};

const fetchStage = async () => {
  try {
    loadingMap.value = true;
    const tiles = await fetchWorldMap(choosenStage.value);
    stageName.value = choosenStage.value
    world.setWorldTiles(tiles);
  } catch (error) {
    console.error(error);
  } finally {
    loadingMap.value = false;
  }
};

const fetchAvailableMaps = async () => {
  try {
    loadingStageOptions.value = true;
    availableStages.value = await fetchAvailableStages();
  } catch (error) {
    console.error(error);
  } finally {
    loadingStageOptions.value = false;
  }
};

// Hooks
onBeforeMount(() => {
  fetchStage();
  getTiles();
  getCoverTiles();
});

onMounted(()=>{
  world.isCreatingWorld.value = true;
  connect();
});

onUnmounted(() => {
  disconnect();
});

// Local functions
const handleSelection = () => {
  if (!tileType.value.value) spriteSet.value=dropdownDefaultOption;
  if (tileType.value.value && spriteSet.value.value) {
    getAvailableFrames();
    selectedFrame.value = null;
  }
}

const handleLoadStageModal = () => {
  showModal.value=true;
  fetchAvailableMaps();
  loadMapAction.value = true;
};

const handleSaveStageModal = () => {
  showModal.value=true;
  saveMapAction.value = true;
};

const loadMapAction: Ref<boolean> = ref(false);
const saveMapAction: Ref<boolean> = ref(false);
const handleModalAction = () =>{
  if (loadMapAction.value) {
    fetchStage();
  }
  if (saveMapAction.value) {
    saveStage();
  }
  handleModalClose();
};

const handleModalClose = () => {
  loadMapAction.value = false;
  saveMapAction.value = false;
}

</script>

<template>

  <MModal needsAction v-model:show="showModal" title="Carregar mapa" @accept="handleModalAction()" @close="handleModalClose">
    <template #content>
      <div class="modal-content-container">
        <MStageList v-if="loadMapAction" v-model="choosenStage" v-model:stageList="availableStages" />
        <div v-if="saveMapAction">Você deseja salvar o mapa {{ stageName }}? (Será sobrescrito caso já exista)</div>
      </div>
    </template>
  </MModal>

  <div class="main-content cross-container">
    <div v-if="!loadingMap" class="content-wrapper">
      <MBorder class="noise-container mr-5" thickness="thick">
        <MWorldGrid v-model="selectedFrame" class="m-3"/>
      </MBorder>
      <div class="flex-column" style="width: 184px;">
        <MBorder class="noise-container mb-5" inverted>
            <MDropDown
              class="m-2"
              v-model="tileType"
              :options="tileTypeOptions"
              @change="handleSelection()"
            />
            <MDropDown
              class="m-2 mt-0"
              :disabled="!tileTypeName"
              v-model="spriteSet"
              :options="spriteSetOptions.filter(opt=>opt.category===(SpriteGroup[tileType.value as keyof typeof SpriteGroup]))"
              type="group"
              placeholder="Selecione"
              @change="handleSelection()"
            />
        </MBorder>
        <MBorder class="noise-container mb-5 flex-grow-1" thickness="thick">
          <MTilesList v-model="selectedFrame" v-model:frames="frames" v-model:stageName="stageName"/>
        </MBorder>
        <div>
          <MButton accent class="w-full mb-5" style="height:30px" label="Carregar mapa" @click="handleLoadStageModal()"/>
          <!-- <MButton accent class="w-full mb-5" style="height:30px" label="Carregar JSON" @click="fetchStage()"/> -->
        </div>
        <div>
          <MButton :disabled="!stageName" class="w-full" style="height:30px" label="Salvar mapa" @click="handleSaveStageModal()"/>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
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

.modal-content-container {
  display: flex;
  justify-content: space-between;

}

@media (max-width: 1200px) {
  .content-wrapper {
    display: flex;
    flex-direction: column;
    margin-top: 2rem;
  }
}

</style>
