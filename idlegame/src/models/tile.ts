export type TileModel = {
  x: number
  y: number
  blocked: boolean
  creatureId?: string | null
  spriteName: string
  frameId: Array<number>
}
