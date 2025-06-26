import { computed, ref, type Ref } from "vue";
import { useCreatures } from "./creatures.composable";
import { WorldTileDto, TileRenderDataDto } from "@/models/tile.model";
import type { Position } from "@/models/generics.model";
import type { FrameDto } from "@/models/frame.model";
import { SpriteGroup } from "@/utils/constants";
import { getEnumValueByKey } from "@/utils/functions";
import type { CreatureDto } from "@/models/creature.model";

const creatures = useCreatures();

const frameDeltaTime = 15;
let frameRendererLoopInterval: number | null = null;
const localFrameTimer: Ref<number> = ref(0);

const isRunning: Ref<boolean> = ref(false);
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

    // console.log("deltaTime:",deltaTime);
    creatures.creaturesOnField.value.forEach(ent=>{
      // console.log("entity:",ent.name);
      // console.log("posX:",ent.renderData.position.x);
      // ent.renderData.orientation=Orientation.EAST;
      // ent.renderData.entityState=EntityState.MOVING;
      // ent.renderData.slotFrameId=[0, 4, 8, 12, 16, 20, 24]
      // ent.renderData.position.x+=deltaTime/1000*64;
    });

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

  const getTileByCreatureId = (creature: CreatureDto | number | undefined) => {
    if (!creature) return null;
    const creatureRef = creatures.getCreatureOnField(creature);
    if (creatureRef) {
      return worldTiles.value.find((t) => t.presentCreature === creatureRef);
    }
    return null;
  };

  const addCreatureOnTile = (creature: CreatureDto | number, tile: WorldTileDto | number) => {
    const creatureRef = creatures.getCreatureOnTeam(creature);
    const tileRef = getTile(tile);
    if (!creatureRef || !tileRef) return;

    // check creature source
    const isCreatureOnField = !!creatures.getCreatureOnField(creature);

    if (isCreatureOnField) {
      const srcTileRef = getTileByCreatureId(creatureRef); // src Tile
      if (srcTileRef) {
        srcTileRef.presentCreature = null;
        if (tileRef.presentCreature) {
          // occupied tile
          srcTileRef.presentCreature = tileRef.presentCreature;
          creatures.addCreatureToField(tileRef.presentCreature, srcTileRef);
        }
      }
    } else {
      if (tileRef.presentCreature) {
        // occupied tile
        creatures.removeCreatureFromField(tileRef.presentCreature);
      }
    }
    creatures.addCreatureToField(creatureRef, tileRef);
    tileRef.presentCreature = creatureRef;
  };

  const removeCreatureFromTile = (creature: CreatureDto | number, tile: WorldTileDto | number) => {
    const creatureRef = creatures.getCreatureOnTeam(creature);
    const tileRef = getTile(tile);
    if (!creatureRef || !tileRef) return;

    tileRef.presentCreature = null;
    creatures.removeCreatureFromField(creatureRef);
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

  const placeSystemCreature = (position: Position, newFrame: FrameDto) => {
    const tile = worldTiles.value.find((t) => t.position === position);
    if (!tile) return;
    const spriteGroup = getEnumValueByKey(SpriteGroup, newFrame.sprite.spriteGroup);
    if (spriteGroup === SpriteGroup.CREATURE) {
      // tile.baseTile = new TileRenderDataDto(newFrame);
    }
  };

  const removeSystemCreature = (position: Position) => {
    const tile = worldTiles.value.find((t) => t.position === position);
    if (!tile) return;
    // tile.tileCover.pop();
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
    addCreatureOnTile,
    removeCreatureFromTile,
    swapTile,
    removeLastCover,
  };
};
