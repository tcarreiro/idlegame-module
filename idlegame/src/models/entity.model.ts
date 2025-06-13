import { EntitySize, EntityState, Orientation } from "@/utils/constants";
import type { Position } from "./tile.model";

export class EntityModel {
  position: Position = { x: 0, y: 0, z: 0 };
  entity: Entity = new Entity();
  entityState: EntityState = EntityState.IDLE; // spritesheet selection img filename = {spriteName}_{entityState}.png
  slotFrameId: Array<number> = [0]; // always "idle"
  slotOffset: Position = { x: 0, y: 0, z: 0 };
  frameId: Array<number> = [0]; // spritesheet row. Idle == 0
  orientation: Orientation = Orientation.NORTH; // spritesheet col
  entitySize: EntitySize = EntitySize.SMALL;
}

export class Entity {
  id: string = "";
  name: string  = "";
  level: number = 0;
  maxHp:number = 0;
  currentHp:number = 0;
  maxResource:number = 0;
  currentResource:number = 0;
  tier: number = 0;
  onField: boolean = false;
}
