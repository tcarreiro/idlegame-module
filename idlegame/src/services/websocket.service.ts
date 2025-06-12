import { Client, type IMessage, type StompSubscription } from '@stomp/stompjs'
import SockJS from 'sockjs-client'

// Endpoint do backend
const socketUrl = 'http://localhost:8081/ws'

let stompClient: Client | null = null
let subscriptions: Record<string, StompSubscription> = {} // Gerencia múltiplos tópicos

/**
 * Conecta ao WebSocket com STOMP
 * @param onConnect Callback quando conectar
 * @param onError Callback quando ocorrer erro
 */
export const connectWebSocket = (onConnect?: () => void, onError?: (error: string) => void) => {
  if (stompClient?.connected) return

  stompClient = new Client({
    webSocketFactory: () => new SockJS(socketUrl),
    debug: (str) => console.log('STOMP:', str),
    reconnectDelay: 5000,
    onConnect: () => {
      console.log('✅ WebSocket conectado')
      onConnect?.()
    },
    onStompError: (frame) => {
      console.error('❌ Erro STOMP:', frame.headers['message'])
      onError?.(frame.headers['message'])
    },
  })

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
    console.warn('⚠️ Tentativa de envio antes da conexão estar ativa.')
  }
}

/**
 * Escuta um tópico STOMP
 * @param topic ex: '/topic/game-events'
 * @param onMessage callback para mensagens recebidas
 */
export const subscribe = (topic: string, onMessage: (msg: IMessage) => void): void => {
  if (!stompClient || !stompClient.connected) {
    console.warn(`⚠️ Cliente STOMP ainda não conectado, subscribe adiado: ${topic}`)
    return
  }

  if (subscriptions[topic]) {
    subscriptions[topic].unsubscribe()
  }

  subscriptions[topic] = stompClient.subscribe(topic, onMessage)
}

/**
 * Cancela uma assinatura de tópico
 * @param topic tópico STOMP a cancelar
 */
export const unsubscribe = (topic: string): void => {
  subscriptions[topic]?.unsubscribe()
  delete subscriptions[topic]
}

/**
 * Desconecta do WebSocket
 */
export const disconnectWebSocket = (): void => {
  Object.values(subscriptions).forEach((s) => s.unsubscribe())
  subscriptions = {}
  stompClient?.deactivate()
  stompClient = null
}
