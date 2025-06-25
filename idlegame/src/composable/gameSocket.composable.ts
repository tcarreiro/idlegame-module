import { ref, onBeforeUnmount, type Ref } from "vue";
import {
  connectWebSocket,
  sendMessage,
  subscribe,
  unsubscribe,
  disconnectWebSocket,
} from "@/services/websocket.service";
import type { IMessage } from "@stomp/stompjs";
import { useWorld } from "./World.composable";
import { useApp } from "@/stores/app";

const subscriptions: Ref<Array<string>> = ref([]);
const isConnected = ref(false);
const messages = ref<Array<IMessage>>([]);
const deltaTime: Ref<number> = ref(0);
const lastTickTimer: Ref<number> = ref(0);
const world = useWorld();

export const useGameSocket = () => {

  const { username } = useApp();
  const connect = () => {
    connectWebSocket(
      () => {
        isConnected.value = true;
        subscribeToChannel("global");
        // subscribeTickManager();
        subscribeToBattleChannel(`/user/${username}/queue/battle/update`);
        subscribeToBattleChannel(`/user/${username}/queue/battle/finished`);
      },
      (error) => {
        console.error("Erro na conexão WebSocket:", error);
      },
    );
  };

  const disconnect = () => {
    subscriptions.value.forEach((channel) => {
      unsubscribeToChannel(channel);
    });
    world.stopFrameTimer();
    disconnectWebSocket();
    isConnected.value = false;
  };

  const sendGameMessage = (event: string, payload: any) => {
    sendMessage(`/app/${event}`, payload);
  };

  const subscribeToChannel = (channel: string) => {
    if (!subscriptions.value.includes(channel)) {
      subscribe(`/topic/game/${channel}`, onBattleMessage);
      subscriptions.value.push(channel);
    }
  };

  const subscribeToBattleChannel = (channel: string) => {
    if (!subscriptions.value.includes(channel)) {
      subscribe(`${channel}`, onBattleMessage);
      subscriptions.value.push(channel);
    }
  };

  const unsubscribeToChannel = (channel: string) => {
    unsubscribe(`/topic/game/${channel}`);
    subscriptions.value.filter((ch) => channel !== ch); // TODO: better remove
  };

  const onBattleMessage = (msg: IMessage) => {
    const data = JSON.parse(msg.body);
    // console.log("Mensagem broadcast do jogo:", data);
    if (data.hasOwnProperty("battleResult")) {
      world.setWorldState(false)
    } else {
      const newTickTimer = Number(data.timeStamp); //server time in millis
      deltaTime.value = newTickTimer - lastTickTimer.value;
      if (lastTickTimer.value !== 0) { // ignore first tick
        world.updateWorld(deltaTime.value);
      }
      lastTickTimer.value = newTickTimer;
    }
    messages.value.push(data);
  };

  const newTick = (tickMsg: IMessage) => {
    const newTickTimer = Number(tickMsg.body); //server time in millis
    deltaTime.value = newTickTimer - lastTickTimer.value;
    if (lastTickTimer.value !== 0) { // ignore first tick
      world.updateWorld(deltaTime.value);
    }
    lastTickTimer.value = newTickTimer;
  };

  const subscribeTickManager = () => {
    if (!subscriptions.value.includes("tick")) {
      subscribe("/topic/game/tick", newTick);
      subscriptions.value.push("tick");
    }
  };

  onBeforeUnmount(() => {
    disconnect();
  });

  return {
    world,
    isConnected,
    messages,
    subscriptions,
    connect,
    subscribeToChannel,
    subscribeToBattleChannel,
    disconnect,
    sendGameMessage,
  };
};
