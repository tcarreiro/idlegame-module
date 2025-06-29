import type { MDropDownItem } from "@/components/forms/MDropDown.vue";

export const tileSize = 64
export const spriteSize = 128
export const frameSize = 32

export const dropdownDefaultOption:MDropDownItem = { label: 'Selecione', value: "" };

export enum SpriteGroup {
  BASE_TILE = "baseTile",
  COVER_TILE = "coverTile",
  PROP = "prop",
  CREATURE = "creature",
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

const DirectionMap: Record<Orientation, { x: number; y: number }> = {
  [Orientation.NORTH]: { x: 0, y: -1 },
  [Orientation.EAST]: { x: 1, y: 0 },
  [Orientation.SOUTH]: { x: 0, y: 1 },
  [Orientation.WEST]: { x: -1, y: 0 },
};

export const Direction = (orientation: Orientation) => DirectionMap[orientation];

export enum EntitySize {
  SMALL = "SMALL",
  MEDIUM = "MEDIUM",
  BIG = "BIG",
}
