import type { CreatureDto } from "@/models/creature.model";
import { Position } from "@/models/generics.model";
import { EntitySize } from "@/utils/constants";
import { ref, type Ref } from "vue";



const creatureBeingDrag: Ref<CreatureDto|null> = ref(null);
const creaturesOnTeam: Ref<Array<CreatureDto>> = ref([]);
const creaturesOnField: Ref<Array<CreatureDto>> = ref([]);
// const entitiesOnBox: Ref<Array<CreatureDto>> = ref([]); //  FUTURE

export const useCreatures = () => {

  const SMALL_ENTITY_CONFIG = {
    creatureAtlasSize: 32,
    atlasNumCols: 4,
    creatureWorldScale: 2,
    get creatureWorldSize() {
      return this.creatureAtlasSize * this.creatureWorldScale;
    },
  };

  const MEDIUM_ENTITY_CONFIG = {
    creatureAtlasSize: 48,
    atlasNumCols: 4,
    creatureWorldScale: 2,
    get creatureWorldSize() {
      return this.creatureAtlasSize * this.creatureWorldScale;
    },
  };

  const BIG_ENTITY_CONFIG = {
    creatureAtlasSize: 64,
    atlasNumCols: 4,
    creatureWorldScale: 2,
    get creatureWorldSize() {
      return this.creatureAtlasSize * this.creatureWorldScale;
    },
  };

  const sizeConfig = (entitySize: EntitySize)=>{
    switch(entitySize) {
      case EntitySize.SMALL:
        return SMALL_ENTITY_CONFIG
      case EntitySize.MEDIUM:
        return MEDIUM_ENTITY_CONFIG
      case EntitySize.BIG:
        return BIG_ENTITY_CONFIG
    }
  };

  const setCreatureTeam = (creatures: Array<CreatureDto>) => {
    creaturesOnTeam.value = creatures;
  };

  const addCreatureToTeam = (creature: CreatureDto) => {
    if (!creaturesOnTeam.value.some((e) => e.id === creature.id)) creaturesOnTeam.value.push(creature);
  };

  const removeCreatureToTeam = (creature: CreatureDto | number) => {
    const creatureRef = getCreatureOnTeam(creature);
    if (creatureRef) {
      creaturesOnTeam.value = creaturesOnTeam.value.filter((e) => e !== creatureRef);
      removeCreatureFromField(creatureRef);
    }
  };

  const setDraggingCreature = (creature: CreatureDto | number | null) => {
    if (!creature) {
      creatureBeingDrag.value = null;
      return;
    }
    const creatureRef = getCreatureOnTeam(creature);
    if (creatureRef) {
      creatureBeingDrag.value = creatureRef;
    }
  };

  const addCreatureToField = (creature: CreatureDto | number, position: Position) => {
    const creatureRef = getCreatureOnTeam(creature);
    if (creatureRef) {
      if (!creaturesOnField.value.includes(creatureRef)) {
        creatureRef.onField = true;
        creatureRef.baseCreature.renderData.position = position;
        creaturesOnField.value.push(creatureRef);
      }
    }
  };

  const removeCreatureFromField = (creature: CreatureDto | number) => {
    const creatureRef = getCreatureOnTeam(creature);
    if (creatureRef) {
      const index = creaturesOnField.value.findIndex((e) => e === creatureRef);
      if (index !== -1) {
        creaturesOnField.value.splice(index, 1);
      }
      creatureRef.onField = false;
      creatureRef.baseCreature.renderData.position = new Position();
    }
  };

  const getCreatureOnTeam = (creature: CreatureDto | number) => {
    return typeof creature === "number"
      ? creaturesOnTeam.value.find((e) => e.id === creature)
      : creaturesOnTeam.value.find((e) => e === creature);
  };

  const getCreatureOnField = (creature: CreatureDto | number) => {
    return typeof creature === "number"
      ? creaturesOnField.value.find((e) => e.id === creature)
      : creaturesOnField.value.find((e) => e === creature);
  };

  return {
    creaturesOnTeam,
    creaturesOnField,
    creatureBeingDrag,
    sizeConfig,
    setCreatureTeam,
    addCreatureToTeam,
    removeCreatureToTeam,
    setDraggingCreature,
    removeCreatureFromField,
    addCreatureToField,
    getCreatureOnTeam,
    getCreatureOnField,
  };
};
