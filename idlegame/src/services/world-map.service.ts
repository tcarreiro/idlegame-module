import type { TileModel } from "@/models/tile.model";
import { getAxios } from "./services.config";

export async function fetchWorldMap(): Promise<Array<TileModel>> {
  return getAxios().get(`/world`)
}
