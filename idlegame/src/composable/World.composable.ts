import { tileSize, spriteSize, frameSize } from '@/utils/constants'
import { Rectangle, type Graphics } from 'pixi.js';
import { computed, ref, type Ref } from 'vue';

const scale = tileSize / frameSize;

const screenWidth: Ref<number> = ref(window.innerWidth);
const screenHeight: Ref<number> = ref(window.innerHeight);

const mapScreenSize: Ref<number> = ref(11 * tileSize)
const mapPadding: Ref<number> = ref(tileSize / 4)
const screenMarginXS: Ref<number> = ref(tileSize / 4)

const mainContainerPaddingTop: Ref<number> = ref(tileSize);

const updateSize = () => {
  screenWidth.value = window.innerWidth
  screenHeight.value = window.innerHeight
}

///////////////
// World map //
///////////////
const mainContainerRect = computed(() => {
  return new Rectangle(
    screenWidth.value / 2 - mapScreenSize.value / 2 - mapPadding.value,
    mainContainerPaddingTop.value - mapPadding.value,
    mapScreenSize.value + 2 * mapPadding.value,
    mapScreenSize.value + 2 * mapPadding.value,
  )
});

const mapScreenRect = computed(() => {
  return new Rectangle(
    mapPadding.value,
    mapPadding.value,
    mapScreenSize.value,
    mapScreenSize.value,
  )
});

///////////////
//  sideHud  //
///////////////

const sideHudWidth: Ref<number> = ref(4 * (tileSize+10)-13)
const sideHudHeight: Ref<number> = ref(11 * tileSize)
const userHudHeight: Ref<number> = ref(1 * tileSize)

const sideHudRect = computed(() => {
  return new Rectangle(
    mainContainerRect.value.x + mainContainerRect.value.width + screenMarginXS.value,
    mainContainerRect.value.y,
    sideHudWidth.value,
    sideHudHeight.value + 2 * mapPadding.value,
  )
})

const userDataRect = computed(() => {
  return new Rectangle(0, 0, sideHudWidth.value, userHudHeight.value)
})

const bestiaryDataRect = computed(() => {
  return new Rectangle(
    0,
    userDataRect.value.height + screenMarginXS.value,
    sideHudWidth.value,
    sideHudRect.value.height - userDataRect.value.height - screenMarginXS.value,
  )
})


export function useWorld() {
  return {
    updateSize,
    tileSize,
    spriteSize,
    scale,
    screenWidth,
    screenHeight,
    mainContainerRect,
    mapScreenRect,
    sideHudRect,
    userDataRect,
    bestiaryDataRect,
  }
}
