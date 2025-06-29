import { CommandState, type BattleCommand } from "@/models/battle-message.model";
import type { CreatureDto } from "@/models/creature.model";
import { EntityState, Orientation } from "@/utils/constants";
import { calculateMoveDuration, samePosition } from "@/utils/functions";

export const useBattleHandler = () => {

  const handleMoveCommand = (creature: CreatureDto, cmd: BattleCommand) => {
    if (!cmd.targetPosition || !cmd.srcPosition) return;

    // const speed = creature.stats.baseSpeed + creature.stats.modSpeed;
    // const dst = Math.abs(cmd.targetPosition.x - cmd.srcPosition.x);
    // const duration = calculateMoveDuration(dst, speed);

    creature.baseCreature.renderData.entityState = EntityState.MOVING;
    creature.baseCreature.renderData.frameIndex = [0, 1, 2, 3, 4, 5, 6, 7]; // ex

    if (cmd.targetPosition.x < creature.baseCreature.renderData.position.x) {
      creature.baseCreature.renderData.orientation = Orientation.WEST;
    }
    if (cmd.targetPosition.x > creature.baseCreature.renderData.position.x) {
      creature.baseCreature.renderData.orientation = Orientation.EAST;
    }
    if (cmd.targetPosition.y < creature.baseCreature.renderData.position.y) {
      creature.baseCreature.renderData.orientation = Orientation.NORTH;
    }
    if (cmd.targetPosition.y > creature.baseCreature.renderData.position.y) {
      creature.baseCreature.renderData.orientation = Orientation.SOUTH;
    }

    if (cmd.targetPosition) {
      // Atualiza posição com transição
      creature.baseCreature.renderData.position = {
        x: cmd.targetPosition.x,
        y: cmd.targetPosition.y,
        z: cmd.targetPosition.z,
      };
    }

    cmd.commandState = CommandState.FINISHED;
  };

  const handleAttackCommand = (creature: CreatureDto, cmd: BattleCommand) => {
    // creature.baseCreature.renderData.entityState = EntityState.ATTACKING; // attack state is not the same as movement state

    // Poderia usar também o orientation com base na posição do target
    // Para uma animação rápida
    setTimeout(() => {
      creature.baseCreature.renderData.entityState = EntityState.IDLE;
    }, 300); // duração da animação de ataque
  };

  const handleSkillCommand = (creature: CreatureDto, cmd: BattleCommand) => {
    // creature.baseCreature.renderData.entityState = EntityState.CASTING; // attack state is not the same as movement state

    // Se quiser animar com efeito gráfico, pode usar cmd.targetPosition ou targetCreatureId

    setTimeout(() => {
      creature.baseCreature.renderData.entityState = EntityState.IDLE;
    }, 600); // duração da animação de skill
  };

  const handleStopCommand = (creature: CreatureDto, cmd: BattleCommand) => {
    creature.baseCreature.renderData.entityState = EntityState.IDLE;
  };

  return {
    handleMoveCommand,
    handleSkillCommand,
    handleStopCommand,
    handleAttackCommand,
  };
};
