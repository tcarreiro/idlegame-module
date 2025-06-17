import type { WorldTileDto } from "@/models/tile.model";
import { getAxios } from "./services.config";
import type { FrameDto } from "@/models/frame.model";

export async function fetchWorldMap(): Promise<Array<WorldTileDto>> {
  return getAxios().get(`/world`)
}

// export async function fetchWorldMap(): Promise<Array<Tile>> {
//   return getAxios().get(`/tiles/stage`, {
//     params: {
//       stageName:"teste"
//     }
//   });
// }

export async function fetchFramesByGroupAndName(
  tileTypeName: string,
  spriteSetName: string,
): Promise<Array<FrameDto>> {
  return getAxios().get(`/tiles/frame`, {
    params: {
      spriteGroup: tileTypeName,
      spriteName: spriteSetName,
    },
  });
}
