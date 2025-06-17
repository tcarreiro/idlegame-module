import type { Entity } from "./entity.model";
import type { FrameDto } from "./frame.model";
import { Position } from "./generics.model";
import { SpriteDto } from "./sprite.model";

export class WorldTileDto {
  id:number=0;
  position:Position = new Position();
  baseTile: TileRenderDataDto = new TileRenderDataDto();
  tileCover: Array<TileRenderDataDto> = [];

  // objects: Array<TileRenderData> = []; // FUTURE
  // effects: Array<TileRenderData> = []; // FURUTE
  presentEntity: Entity|null = null; // ref to Entity

  static fromJSON(json: unknown): WorldTileDto {
    const raw = json as Partial<WorldTileDto>;
    return Object.assign(new WorldTileDto(), raw);
  }

  isBlocked() {
    return !this.baseTile.walkable || !!this.tileCover.filter((tc)=>!tc.walkable).length;
  }
}

export class TileRenderDataDto {
  id: number = 0;
  sprite: SpriteDto = new SpriteDto();
  yOffset: number = 0;
  walkable: boolean = true;
  movable: boolean = false;
  frameId: Array<number> = [];

  constructor(frame?: FrameDto) {
    if (frame) {
      this.id = frame.id;
      this.sprite = frame.sprite;
      this.yOffset = frame.yOffset;
      this.walkable = frame.walkable;
      this.movable = frame.movable;
      this.frameId = frame.frameIndex;
    }
  }
}

