import type { EntityModel } from "@/models/entity.model";
import { computed, ref, type Ref } from "vue";
import { useCreatures } from "./entity.composable";

const creatures = useCreatures();

const worldTime: Ref<number> = ref(0);

const localFrameTimer: Ref<number> = ref(0);
const frameDeltaTime = 15;
const isRunning: Ref<boolean> = ref(true);
let gameLoopInterval: number | null = null;

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
    if (gameLoopInterval !== null) return;
    gameLoopInterval = setInterval(() => {
      if (!isRunning.value) return;
      localFrameTimer.value += frameDeltaTime;
    }, frameDeltaTime);
  };

  const stopFrameTimer = () => {
    if (gameLoopInterval !== null) {
      clearInterval(gameLoopInterval);
      gameLoopInterval = null;
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

  return {
    TILE_CONFIG,
    worldTime,
    formattedTime,
    creatures,
    localFrameTimer,
    isRunning,
    stopFrameTimer,
    updateWorld,
    setWorldState,
  };
};
