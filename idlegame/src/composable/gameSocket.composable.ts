import { ref, onBeforeUnmount, type Ref } from 'vue'
import {
  connectWebSocket,
  sendMessage,
  subscribe,
  unsubscribe,
  disconnectWebSocket,
} from '@/services/websocket.service'
import type { IMessage } from '@stomp/stompjs'

const subscriptions:Ref<Array<string>> = ref([]);

export const useGameSocket = () => {
  const isConnected = ref(false)
  const messages = ref<any[]>([])

  const connect = () => {
    connectWebSocket(
      () => {
        isConnected.value = true
      },
      (error) => {
        console.error('Erro na conexão WebSocket:', error)
      },
    )
  }

  const disconnect = () => {
    subscriptions.value.forEach((channel) => {
      unsubscribeToChannel(channel)
    })
    disconnectWebSocket()
    isConnected.value = false
  }

  const sendGameMessage = (event: string, payload: any) => {
    sendMessage(`/app/${event}`, payload)
  }

  const subscribeToChannel = (channel:string) => {
    subscribe(`/topic/game/${channel}`, onGameMessage);
    subscriptions.value.push(channel);
  };

  const unsubscribeToChannel = (channel:string) => {
    unsubscribe(`/topic/game/${channel}`);
    subscriptions.value.filter((ch)=>channel!==ch); // TODO: better remove
  };

  const onGameMessage = (msg: IMessage) => {
    const data = JSON.parse(msg.body)
    console.log('Mensagem broadcast do jogo:', data)
    messages.value.push(data)
  }

  // Clean up ao desmontar o componente
  onBeforeUnmount(() => {
    disconnect()
  })

  return {
    isConnected,
    messages,
    connect,
    disconnect,
    sendGameMessage,
  }
}
