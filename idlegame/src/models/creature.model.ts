import { EntityState, Orientation } from "@/utils/constants";
import { SpriteDto } from "./sprite.model";
import { Position } from "./generics.model";

export class CreatureDto {
  id: number = 0;
  nickName: string = "";
  stats: StatsDto = new StatsDto();
  baseCreature: BaseCreatureDto = new BaseCreatureDto();
  onField: boolean = false;
}

export class BaseCreatureDto {
  name: string = "";
  baseStats: BaseStatsDto = new BaseStatsDto();
  renderData: RenderDataDto = new RenderDataDto();
}

export class StatsDto {
  level: number = 0;
  baseMaxHp: number = 0;
  modMaxHp: number = 0;
  baseMaxResource: number = 0;
  modMaxResource: number = 0;
  baseAttack: number = 0;
  modAttack: number = 0;
  baseAbilityPower: number = 0;
  modAbilityPower: number = 0;
  baseAttackSpeed: number = 0;
  modAttackSpeed: number = 0;
  baseArmor: number = 0;
  modArmor: number = 0;
  baseMagicResistance: number = 0;
  modMagicResistance: number = 0;
  baseSpeed: number = 0;
  modSpeed: number = 0;
}

export class BaseStatsDto {
  minBaseMaxHp: number = 0;
  maxBaseMaxHp: number = 0;
  minBaseMaxResource: number = 0;
  maxBaseMaxResource: number = 0;
  minBaseAttack: number = 0;
  maxBaseAttack: number = 0;
  minBaseAbilityPower: number = 0;
  maxBaseAbilityPower: number = 0;
  minBaseAttackSpeed: number = 0;
  maxBaseAttackSpeed: number = 0;
  minBaseArmor: number = 0;
  maxBaseArmor: number = 0;
  minBaseMagicResistance: number = 0;
  maxBaseMagicResistance: number = 0;
  minBaseSpeed: number = 0;
  maxBaseSpeed: number = 0;
}

export class RenderDataDto {
  entityState: EntityState = EntityState.IDLE;
  frameIndex: Array<number> = [0];
  sprite: SpriteDto = new SpriteDto();
  orientation: Orientation = Orientation.SOUTH;
  position: Position = new Position();
}
