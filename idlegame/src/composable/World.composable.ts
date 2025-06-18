import { computed, ref, type Ref } from "vue";
import { useEntities } from "./entity.composable";
import { WorldTileDto, TileRenderDataDto } from "@/models/tile.model";
import { RenderData, type Entity } from "@/models/entity.model";
import type { Position } from "@/models/generics.model";
import type { FrameDto } from "@/models/frame.model";
import { SpriteGroup } from "@/utils/constants";
import { getEnumValueByKey } from "@/utils/functions";

const entities = useEntities();

const frameDeltaTime = 15;
let frameRendererLoopInterval: number | null = null;
const localFrameTimer: Ref<number> = ref(0);

const isRunning: Ref<boolean> = ref(true);
const worldTime: Ref<number> = ref(0);

const worldTiles:Ref<Array<WorldTileDto>> = ref([]);

// for  creation purpose
const isCreatingWorld:Ref<boolean> = ref(false);

export const useWorld = () => {
  const TILE_CONFIG = {
    tileAtlasSize: 32,
    atlasNumCols: 4,
    tileWorldScale: 2,
    get tileWorldSize() {
      return this.tileAtlasSize * this.tileWorldScale;
    },
  };

  const updateWorld = (deltaTime: number) => {
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
    const hr = computed(() => String(Math.trunc(worldTime.value / 3600000)).padStart(2, "0"));
    const min = computed(() =>
      String(Math.min(Math.trunc(worldTime.value / 60000 - parseInt(hr.value) * 60), 59)).padStart(
        2,
        "0",
      ),
    );
    const sec = computed(() =>
      String(
        Math.min(
          Math.trunc(worldTime.value / 1000 - parseInt(hr.value) * 3600 - parseInt(min.value) * 60),
          59,
        ),
      ).padStart(2, "0"),
    );
    return { hr, min, sec };
  };

  const setWorldState = (running: boolean) => {
    isRunning.value = running;
  };

  const setWorldTiles = (tiles: Array<WorldTileDto>) => {
    worldTiles.value = [];
    tiles.forEach((tile) => {
      worldTiles.value.push(WorldTileDto.fromJSON(tile));
    });
  };

  const getTile = (tile: WorldTileDto | number) => {
    return typeof tile === "number" ? worldTiles.value.find((t) => t.id === tile) : tile;
  };

  const getTileByCreatureId = (entity: Entity | string | undefined) => {
    if (!entity) return null;
    const entityRef = entities.getEntityOnField(entity);
    if (entityRef) {
      return worldTiles.value.find((t) => t.presentEntity === entityRef);
    }
    return null;
  };

  const addEntityOnTile = (entity: Entity | string, tile: WorldTileDto | number) => {
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
        if (tileRef.presentEntity) {
          // occupied tile
          srcTileRef.presentEntity = tileRef.presentEntity;
        }
      }
    }
    entities.addEntityToField(entityRef);
    tileRef.presentEntity = entityRef;
  };

  const removeEntityFromTile = (entity: Entity | string, tile: WorldTileDto | number) => {
    const entityRef = entities.getEntityOnTeam(entity);
    const tileRef = getTile(tile);
    if (!entityRef || !tileRef) return;

    tileRef.presentEntity = null;
    entities.removeEntityFromField(entityRef);
  };

  //
  // MAP CREATION
  //
  // for map creation purpose, only a few info are really important
  const swapTile = (position: Position, newFrame: FrameDto) => {
    const tile = worldTiles.value.find((t) => t.position === position);
    if (!tile) return;
    const spriteGroup = getEnumValueByKey(SpriteGroup, newFrame.sprite.spriteGroup);
    if (spriteGroup === SpriteGroup.BASE_TILE) {
      tile.baseTile = new TileRenderDataDto(newFrame);
    }
    if (spriteGroup === SpriteGroup.COVER_TILE) {
      const renderData = new TileRenderDataDto(newFrame);
      tile.tileCover.push(renderData);
    }
  };

  const removeLastCover = (position: Position) => {
    const tile = worldTiles.value.find((t) => t.position === position);
    if (!tile) return;
    tile.tileCover.pop();
  };

  return {
    worldTiles,
    worldTime,
    localFrameTimer,
    isRunning,
    isCreatingWorld,
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
    removeLastCover,
  };
};
