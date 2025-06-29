import type { CreatureDto } from "./creature.model";
import { Position } from "./generics.model";

export class BattleMessage {
  battleId: number = 0;
  creaturesOnField: Array<CreatureDto> = [];
  commands: Array<BattleCommand> = [];
}

export enum CommandType {
  STOP = "STOP",
  MOVE = "MOVE",
  ATTACK = "ATTACK",
  USE_SKILL = "USE_SKILL",
}

export enum CommandState {
  QUEUED = "QUEUED",
  ONGOING = "ONGOING",
  FINISHED = "FINISHED",
}

export class BattleCommand {
  creatureId: number = -1;
  type: CommandType = CommandType.STOP;

  // Ponto de partida (pode ser redundante se o front já souber a posição atual)
  srcPosition?: Position;

  // Para movimentos ou skills com target em posição
  targetPosition?: Position;

  // Para ataques ou skills com target em criatura
  targetCreatureId?: number;

  // Tempo absoluto em milissegundos (tick time)
  commandStartTime: number = -1;

  // Estado atual da execução do comando (back pode enviar como QUEUED, Ongoing, etc)
  commandState?: CommandState|null = null;
}
