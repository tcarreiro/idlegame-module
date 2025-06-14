import { EntitySize, EntityState, Orientation } from "@/utils/constants";
import { Position } from "./generics.model";

export class Entity {
  id: string = "";
  name: string  = "";
  stats: Stats = new Stats();
  renderData: RenderData = new RenderData();
  onField: boolean = false;
}

export class Stats {
  level: number = 0;
  maxHp:number = 0;
  currentHp:number = 0;
  maxResource:number = 0;
  currentResource:number = 0;
  tier: number = 0;
}

export class RenderData {
  entityState: EntityState = EntityState.IDLE;
  slotFrameId: Array<number> = [0];
  slotOffset: Position = new Position();
  worldFrameId: Array<number> = [0];
  orientation: Orientation = Orientation.SOUTH;
  entitySizeConfig: EntitySize = EntitySize.SMALL;
}