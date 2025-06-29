import type { CreatureDto } from "@/models/creature.model";
import { getAxios } from "./services.config";
import { useApp } from "@/stores/app";

export const fetchUserTeam = async (): Promise<Array<CreatureDto>> => {
  const { username } = useApp();
  return getAxios().get(`/creatures/user/${username}`);
};
