import type { MDropDownItem } from "@/components/forms/MDropDown.vue";

export const tileSize = 64
export const spriteSize = 128
export const frameSize = 32

export const dropdownDefaultOption:MDropDownItem = { label: 'Selecione', value: "" };

export enum SpriteGroup {
  BASE_TILE = "baseTile",
  COVER_TILE = "coverTile",
  CREATURE = "creature",
  PROP = "prop",
}

export enum EntityState {
  IDLE = "idle",
  MOVING = "moving",
}

export enum Orientation {
  NORTH,
  EAST,
  SOUTH,
  WEST,
}

export enum EntitySize {
  SMALL = "SMALL",
  MEDIUM = "MEDIUM",
  BIG = "BIG",
}
