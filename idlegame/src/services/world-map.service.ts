import type { Tile } from "@/models/tile.model";
import { getAxios } from "./services.config";

export async function fetchWorldMap(): Promise<Array<Tile>> {
  return getAxios().get(`/world`)
}
