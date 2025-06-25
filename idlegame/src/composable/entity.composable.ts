import type { Entity } from "@/models/entity.model";
import { Position } from "@/models/generics.model";
import { EntitySize } from "@/utils/constants";
import { ref, type Ref } from "vue";



const entityBeingDrag: Ref<Entity|null> = ref(null);
const entitiesOnTeam: Ref<Array<Entity>> = ref([]);
const entitiesOnField: Ref<Array<Entity>> = ref([]);
// const entitiesOnBox: Ref<Array<Entity>> = ref([]); //  FUTURE

export const useEntities = () => {

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

  const setEntityTeam = (entities: Array<Entity>) => {
    entitiesOnTeam.value = entities;
  }

  const addEntityToTeam = (entity: Entity) => {
    if (!entitiesOnTeam.value.some(e=>e.id===entity.id))
      entitiesOnTeam.value.push(entity);
  };

  const removeEntityToTeam = (entity: Entity|string) => {
    const entityRef = getEntityOnTeam(entity);
    if (entityRef) {
      entitiesOnTeam.value = entitiesOnTeam.value.filter(e => e!==entityRef);
      removeEntityFromField(entityRef);
    }
  };

  const setDraggingEntity = (entity: Entity|string|null) => {
    if (!entity) {
      entityBeingDrag.value = null
      return;
    }
    const entityRef = getEntityOnTeam(entity);
    if (entityRef) {
      entityBeingDrag.value = entityRef;
    }
  };

  const addEntityToField = (entity: Entity|string, position: Position) => {
    const entityRef = getEntityOnTeam(entity);
    if (entityRef) {
      if (!entitiesOnField.value.includes(entityRef)) {
        entityRef.onField = true;
        entitiesOnField.value.push(entityRef);
      }
    }
  };

  const removeEntityFromField = (entity: Entity|string) => {
    console.log(entity);
    const entityRef = getEntityOnTeam(entity);
    if (entityRef) {
      const index = entitiesOnField.value.findIndex(e=>e===entityRef);
      if (index !== -1) {
        entitiesOnField.value.splice(index, 1);
      }
      entityRef.onField = false;
      entityRef.renderData.position = new Position();
    }
  };

  const getEntityOnTeam = (entity: Entity|string) => {
    return typeof entity === "string" 
      ? entitiesOnTeam.value.find(e => e.id === entity)
      : entitiesOnTeam.value.find(e => e === entity);
  }

  const getEntityOnField = (entity: Entity|string) => {
    return typeof entity === "string" 
      ? entitiesOnField.value.find(e => e.id === entity)
      : entitiesOnField.value.find(e => e === entity);
  }

  return {
    entitiesOnTeam,
    entitiesOnField,
    entityBeingDrag,
    sizeConfig,
    setEntityTeam,
    addEntityToTeam,
    removeEntityToTeam,
    setDraggingEntity,
    removeEntityFromField,
    addEntityToField,
    getEntityOnTeam,
    getEntityOnField,
  };
};
