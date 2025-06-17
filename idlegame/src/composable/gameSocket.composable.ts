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

const subscriptions: Ref<Array<string>> = ref([]);
const isConnected = ref(false);
const messages = ref<Array<IMessage>>([]);
const deltaTime: Ref<number> = ref(0);
const lastTickTimer: Ref<number> = ref(0);
const world = useWorld();

export const useGameSocket = () => {
  const connect = () => {
    connectWebSocket(
      () => {
        isConnected.value = true;
        subscribeToChannel("global");
        subscribeTickManager();
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
    subscribe(`/topic/game/${channel}`, onGameMessage);
    subscriptions.value.push(channel);
  };

  const unsubscribeToChannel = (channel: string) => {
    unsubscribe(`/topic/game/${channel}`);
    subscriptions.value.filter((ch) => channel !== ch); // TODO: better remove
  };

  const onGameMessage = (msg: IMessage) => {
    const data = JSON.parse(msg.body);
    console.log("Mensagem broadcast do jogo:", data);
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
    disconnect,
    sendGameMessage,
  };
};
