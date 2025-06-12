import { ref, type Ref } from 'vue'

const worldTime: Ref<number> = ref(0)
// const deltaTime: Ref<number> = ref(0)
const isRunning: Ref<boolean> = ref(false)
const tickTime = 30

let gameLoopInterval: number | null = null

export const useWorld = () => {
  const TILE_CONFIG = {
    tileAtlasSize: 32,
    atlasNumCols: 4,
    tileWorldScale: 2,
    get tileWorldSize() {
      return this.tileAtlasSize * this.tileWorldScale
    },
  }

  const updateWorld = () => {
    if (gameLoopInterval !== null) return
    gameLoopInterval = setInterval(() => {
        if (!isRunning.value) return
        worldTime.value += tickTime
        // aqui pode mandar stomp/send
      }, tickTime)
  }

  const stopWorld = () => {
    if (gameLoopInterval !== null) {
      clearInterval(gameLoopInterval)
      gameLoopInterval = null
    }
  }

  const setWorldState = (running:boolean) => {
    isRunning.value = running;
  };

  return {
    TILE_CONFIG,
    worldTime,
    isRunning,
    updateWorld,
    setWorldState,
    stopWorld,
  }
}
