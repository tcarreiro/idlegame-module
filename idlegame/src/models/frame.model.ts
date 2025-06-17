import { SpriteDto } from "./sprite.model";

export class FrameDto {
  id: number = 0;
  name: string = "";
  frameIndex: Array<number> = [];
  yOffset: number = 0;
  walkable: boolean = true;
  movable: boolean = false;
  sprite: SpriteDto = new SpriteDto();
}
