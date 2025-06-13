export type TileModel = {
  position:Position;
  blocked: boolean;
  creatureId?: string | null;
  spriteName: string;
  frameId: Array<number>;
}


export type Position = {
  x:number;
  y:number;
  z:number;
}
