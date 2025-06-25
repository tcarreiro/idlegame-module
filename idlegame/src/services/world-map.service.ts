import type { TileDto, WorldTileDto } from "@/models/tile.model";
import { getAxios } from "./services.config";
import type { FrameDto } from "@/models/frame.model";
import type { StageDto } from "@/models/stage.model";

export const fetchWorldMap = async (stageName?: string): Promise<Array<WorldTileDto>> => {
  const finalStageName = stageName && stageName.trim() !== "" ? stageName : "Base";
  return getAxios().get(`/tiles/stage`, {
    params: {
      stageName: finalStageName,
    },
  });
};

export const fetchAvailableStages = async (): Promise<Array<string>> => {
  return getAxios().get(`/tiles/available-stages`);
};

export const fetchFramesByGroupAndName = async (
  tileTypeName: string,
  spriteSetName: string,
): Promise<Array<FrameDto>> => {
  return getAxios().get(`/tiles/frame`, {
    params: {
      spriteGroup: tileTypeName,
      spriteName: spriteSetName,
    },
  });
}

export const saveStageService = async (
  stageName: string,
  tiles: Array<TileDto>,
): Promise<StageDto> => {
  return getAxios().post(`/tiles/stage`, tiles, {
    params: { stageName },
  });
};

export const startBattle = async (): Promise<void> => {
  const body = {
    regionId: 1,
    playersCreatures: [
      {
        creatureId: 1,
        x: 10,
        y: 5,
        equippedItemsIds: [],
      },
    ],
  };
  return getAxios().post(`/battle/start`, body);
};
