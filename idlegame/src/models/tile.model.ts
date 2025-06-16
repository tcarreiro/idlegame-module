import type { Entity } from "./entity.model";
import { Position } from "./generics.model";

export class Tile {
  id:string="";
  position:Position = new Position();
  baseTile: TileRenderData = new TileRenderData();
  tileCover: Array<TileRenderData> = [];
  // objects: Array<TileRenderData> = []; // FUTURE
  // effects: Array<TileRenderData> = []; // FURUTE
  presentEntity: Entity|null = null; // ref to Entity

  static fromJSON(json: unknown): Tile {
    const raw = json as Partial<Tile>;
    return Object.assign(new Tile(), raw);
  }

  isBlocked() {
    return !this.baseTile.walkable || !!this.tileCover.filter((tc)=>!tc.walkable).length;
  }
}

export class TileRenderData {
  id:string="";
  spriteName:string="";
  yOffset:number=0;
  walkable:boolean=true;
  // movable?
  frameId:Array<number>=[];
}

