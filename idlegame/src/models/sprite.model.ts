import { SpriteGroup } from "@/utils/constants";

export class SpriteDto {
  id: number = 0;
  name: string = "";
  spriteGroup: SpriteGroup = SpriteGroup.BASE_TILE;
  width: number = 0;
  height: number = 0;
  frameSize: number = 0;
}
