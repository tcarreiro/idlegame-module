<script setup lang="ts">
import MCreateWorldGrid from '@/components/baseContainer/MCreateWorldGrid.vue';
import MTilesList from '@/components/baseContainer/MTilesList.vue';
import MBorder from '@/components/basic/MBorder.vue';
import MButton from '@/components/forms/MButton.vue';
import MDropDown, { type MDropDownGroup, type MDropDownItem } from '@/components/forms/MDropDown.vue';
import { useGameSocket } from '@/composable/gameSocket.composable';
import { useWorld } from '@/composable/World.composable';
import { FrameDto } from '@/models/frame.model';
import type { WorldTileDto } from '@/models/tile.model';
import { fetchFramesByGroupAndName, fetchWorldMap } from '@/services/world-map.service';
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
const selectedFrame:Ref<FrameDto|null> = ref(null);

const frames:Ref<Array<FrameDto>> = ref([]);

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

const getTiles = () => {
  tileTypeOptions.value =[
    dropdownDefaultOption,
    { label: 'Tile', value: getEnumKeyByValue(SpriteGroup, SpriteGroup.BASE_TILE)?.toString() },
    { label: 'Prop', value: getEnumKeyByValue(SpriteGroup, SpriteGroup.COVER_TILE)?.toString() },
  ];
};

const getCoverTiles = () => {
  spriteSetOptions.value = [
    {
      label: 'Cave',
      category: 'baseTile',
      items: [
        { label: 'caveDirt1', value: "caveDirt1" },
        { label: 'waterDeep1', value: "waterDeep1" },
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

onMounted(()=>{
  connect();
});

onUnmounted(() => {
  disconnect();
});

const handleSelection = () => {
  if (!tileType.value.value) spriteSet.value=dropdownDefaultOption;
  if (tileType.value.value && spriteSet.value.value) {
    getAvailableFrames();
    selectedFrame.value = null;
  }
}

</script>

<template>
  <div class="main-content cross-container">
    <div v-if="!loadingMap" class="content-wrapper">
      <MBorder class="noise-container mr-5" thickness="thick">
        <MCreateWorldGrid v-model="selectedFrame" class="m-3"/>
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
          <MTilesList v-model="selectedFrame" v-model:frames="frames"/>
        </MBorder>
        <div>
          <MButton accent disabled class="w-full mb-5" style="height:30px" label="Carregar JSON"/>
        </div>
        <div>
          <MButton class="w-full" style="height:30px" label="Gerar JSON" @click="console.log(world.worldTiles.value.map(t=>{return {
            baseTile: {
              spriteName:t.baseTile.sprite,
              frameId:t.baseTile.frameId
            },
            coverTile: t.tileCover.map(c=>{return {
              spriteName: c.sprite,
              frameId: c.frameId
            }})
          }}))"/>
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
