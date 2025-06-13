import { Client, type IMessage, type StompSubscription } from '@stomp/stompjs'
import SockJS from 'sockjs-client'

// Endpoint do backend
const socketUrl = 'http://localhost:8081/ws'

let stompClient: Client | null = null
let isConnected = false;

const subscriptions = new Map<string, (message: IMessage) => void>();

/**
 * Conecta ao WebSocket com STOMP
 * @param onConnect Callback quando conectar
 * @param onError Callback quando ocorrer erro
 */
export const connectWebSocket = (onConnect?: () => void, onError?: (error: string) => void) => {
  if (stompClient?.connected) return

  stompClient = new Client({
    webSocketFactory: () => new SockJS(socketUrl),
    // debug: (str) => console.log('STOMP:', str),
    reconnectDelay: 5000,
    onConnect: () => {
      isConnected = true;
      // Reinscreve todos os tópicos
      subscriptions.forEach((callback, topic) => {
        stompClient!.subscribe(topic, callback);
      });

      if (onConnect) onConnect();
    },
    onStompError: (frame) => {
      onError?.(frame.headers["message"]);
    },
    onWebSocketError: (error) => {
      if (onError) onError(error);
    },
    onDisconnect: () => {
      isConnected = false;
      console.warn("WebSocket desconectado");
    },
  });

  stompClient.activate()
}

/**
 * Envia uma mensagem para o backend
 * @param destination rota do STOMP ex: '/app/send-action'
 * @param body objeto que será serializado em JSON
 */
export const sendMessage = (destination: string, body: any) => {
  if (stompClient && stompClient.connected) {
    stompClient.publish({
      destination,
      body: JSON.stringify(body),
    })
  } else {
    console.warn('Tentativa de envio antes da conexão estar ativa.')
  }
}

/**
 * Escuta um tópico STOMP
 * @param topic ex: '/topic/game-events'
 * @param onMessage callback para mensagens recebidas
 */
export function subscribe(topic: string, callback: (message: IMessage) => void) {
  subscriptions.set(topic, callback);

  if (isConnected) {
    stompClient!.subscribe(topic, callback);
  }
}

/**
 * Cancela uma assinatura de tópico
 * @param topic tópico STOMP a cancelar
 */
export function unsubscribe(topic: string) {
  subscriptions.delete(topic)
}

/**
 * Desconecta do WebSocket
 */
export const disconnectWebSocket = (): void => {
  Object.values(subscriptions).forEach((s) => s.unsubscribe())
  subscriptions.clear();
  stompClient?.deactivate()
  stompClient = null
}
