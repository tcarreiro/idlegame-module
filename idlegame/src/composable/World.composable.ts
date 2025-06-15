import { computed, ref, type Ref } from "vue";
import { useEntities } from "./entity.composable";
import { Tile, TileRenderData } from "@/models/tile.model";
import { RenderData, type Entity } from "@/models/entity.model";
import type { Position } from "@/models/generics.model";

const entities = useEntities();

const frameDeltaTime = 15;
let frameRendererLoopInterval: number | null = null;
const localFrameTimer: Ref<number> = ref(0);

const isRunning: Ref<boolean> = ref(true);
const worldTime: Ref<number> = ref(0);

const worldTiles:Ref<Array<Tile>> = ref([]);

// for  creation purpose
const isCreatingWorld:Ref<boolean> = ref(false);
const selectedTile:Ref<Tile|null> = ref(null);

export const useWorld = () => {
  const TILE_CONFIG = {
    tileAtlasSize: 32,
    atlasNumCols: 4,
    tileWorldScale: 2,
    get tileWorldSize() {
      return this.tileAtlasSize * this.tileWorldScale;
    },
  };

  const updateWorld = (deltaTime:number) => {
    // worldTime.value += deltaTime; // before if "pause" stops worldTimer
    if (!isRunning.value) return;
    worldTime.value += deltaTime; // after if "pause" doesn't stop worldTimer
    startFrameTimer();
  };

  const startFrameTimer = () => {
    if (frameRendererLoopInterval !== null) return;
    frameRendererLoopInterval = setInterval(() => {
      if (!isRunning.value) return;
      localFrameTimer.value += frameDeltaTime;
    }, frameDeltaTime);
  };

  const stopFrameTimer = () => {
    if (frameRendererLoopInterval !== null) {
      clearInterval(frameRendererLoopInterval);
      frameRendererLoopInterval = null;
    }
  };

  const formattedTime = () => {
    const hr = computed(() =>String(Math.trunc(worldTime.value / 3600000)).padStart(2, "0"));
    const min = computed(() =>String(Math.min(Math.trunc(worldTime.value / 60000 - parseInt(hr.value) * 60), 59)).padStart(2, "0"));
    const sec = computed(() =>String(Math.min(Math.trunc(worldTime.value / 1000 - parseInt(hr.value) * 3600 - parseInt(min.value) * 60),59)).padStart(2, "0"));
    return {hr, min, sec};
  }

  const setWorldState = (running: boolean) => {
    isRunning.value = running;
  };

  const setWorldTiles = (tiles: Array<Tile>) => {
    worldTiles.value = [];
    tiles.forEach((tile) => {
      worldTiles.value.push(Tile.fromJSON(tile));
    });
  };

  // for map creation purpose, only a few info are really important
  const swapTile = (position: Position, newSpriteAtlas:string, newFrameId: number ) => {
    const tile = worldTiles.value.find((t) => t.position === position);
    if (!tile) return;
    const type = newSpriteAtlas.split("/")[0];
    if (type === "baseTile") {
      tile.baseTile.frameId = [newFrameId];
      tile.baseTile.spriteName = newSpriteAtlas.split("/")[1];
    }
    if (type === "coverTile") {
      const renderData = new TileRenderData();
      renderData.frameId = [newFrameId];
      renderData.spriteName = newSpriteAtlas.split("/")[1];
      tile.tileCover.push(renderData);
    }
  };

  const getTile = (tile: Tile|string) => {
    return typeof tile === "string"
      ? worldTiles.value.find(t => t.id === tile)
      : tile;
  }

  const getTileByCreatureId = (entity:Entity|string|undefined) => {
    if (!entity) return null;
    const entityRef = entities.getEntityOnField(entity);
    if (entityRef) {
      return worldTiles.value.find(t=>t.presentEntity===entityRef);
    }
    return null;
  }

  const addEntityOnTile = (entity:Entity|string, tile: Tile|string) => {
    const entityRef = entities.getEntityOnTeam(entity);
    const tileRef = getTile(tile);
    if (!entityRef || !tileRef) return;

    // check entity source
    const isEntityOnField = !!entities.getEntityOnField(entity);

    // if from field
    if (isEntityOnField) {
      const srcTileRef = getTileByCreatureId(entityRef); // src Tile
      if (srcTileRef) {
        srcTileRef.presentEntity = null;
        if (tileRef.presentEntity) { // occupied tile
          srcTileRef.presentEntity = tileRef.presentEntity;
        }
      }
    }
    entities.addEntityToField(entityRef);
    tileRef.presentEntity = entityRef;
  };

  const removeEntityFromTile = (entity:Entity|string, tile: Tile|string) => {
    const entityRef = entities.getEntityOnTeam(entity);
    const tileRef = getTile(tile);
    if (!entityRef || !tileRef) return;

    tileRef.presentEntity = null;
    entities.removeEntityFromField(entityRef);
  };

  return {
    worldTiles,
    worldTime,
    localFrameTimer,
    isRunning,
    isCreatingWorld,
    selectedTile,
    TILE_CONFIG,
    updateWorld,
    stopFrameTimer,
    formattedTime,
    setWorldState,
    setWorldTiles,
    getTile,
    getTileByCreatureId,
    addEntityOnTile,
    removeEntityFromTile,
    swapTile,
  };
};
