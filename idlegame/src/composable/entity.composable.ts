import type { EntityModel } from "@/models/entity.model";
import { ref, type Ref } from "vue";

const isDraggingEntity: Ref<boolean> = ref(false);
// const entitiesOnBox: { value: EntityModel | null } = { value: null };
const entitiesOnTeam:Ref<Array<EntityModel>> = ref([]);
const currentDragEntityRef: { value: EntityModel | null } = { value: null };
const entitiesOnFieldRef = new Map<string, { value: EntityModel | null }>();

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

  const setEntityTeam = (entities: Array<EntityModel>) => {
    entitiesOnTeam.value = entities;
  }

  const addEntityToTeam = (entityModel: EntityModel) => {
    if (!entitiesOnTeam.value.find((ent) => ent.entity.id === entityModel.entity.id))
      entitiesOnTeam.value.push(entityModel);
  };

  const removeEntityToTeam = (entityModel: EntityModel) => {
    setEntityTeam(entitiesOnTeam.value.filter((ent) => ent.entity.id !== entityModel.entity.id));
  };

  const setIsDraggingCreature = (dragging: boolean, entityRef:EntityModel|null) => {
    isDraggingEntity.value = dragging;
    currentDragEntityRef.value = entityRef;
  }

  const addEntityOnField = (entityRef: EntityModel) => {
    if (!entitiesOnFieldRef.has(entityRef.entity.id ?? "")) {
      entitiesOnFieldRef.set(entityRef.entity.id, { value: entityRef });
    }
  };

  const getEntityRef = (entityId:string) => {
    return entitiesOnFieldRef.get(entityId);
  }

  const removeEntityFromField = (entityId: string) => {
    entitiesOnFieldRef.delete(entityId);
  };

  return {
    SMALL_ENTITY_CONFIG,
    MEDIUM_ENTITY_CONFIG,
    BIG_ENTITY_CONFIG,
    entitiesOnFieldRef,
    currentDragEntityRef,
    isDraggingEntity,
    setEntityTeam,
    removeEntityToTeam,
    addEntityToTeam,
    setIsDraggingCreature,
    getEntityRef,
    addEntityOnField,
    removeEntityFromField,
  };
};
