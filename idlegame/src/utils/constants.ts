export const tileSize = 64
export const spriteSize = 128
export const frameSize = 32

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
