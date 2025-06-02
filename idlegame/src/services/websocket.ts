import { Client, type IMessage, type StompSubscription } from '@stomp/stompjs'
import SockJS from 'sockjs-client'

const socketUrl = 'http://localhost:8081/ws' // ou seu endpoint

let stompClient: Client | null = null

export const connectWebSocket = (
  onMessage: (msg: IMessage) => void,
  onConnect?: () => void,
  onError?: (error: string) => void,
) => {
  stompClient = new Client({
    webSocketFactory: () => new SockJS(socketUrl),
    debug: (str) => console.log('STOMP:', str),
    reconnectDelay: 5000,
    onConnect: () => {
      console.log('✅ WebSocket conectado')
      if (onConnect) onConnect()
    },
    onStompError: (frame) => {
      console.error('❌ Erro STOMP:', frame.headers['message'])
      if (onError) onError(frame.headers['message'])
    },
  })

  stompClient.onUnhandledMessage = onMessage
  stompClient.activate()
}

export const subscribe = (
  topic: string,
  onMessage: (msg: IMessage) => void,
): StompSubscription | null => {
  if (!stompClient || !stompClient.connected) return null
  return stompClient.subscribe(topic, onMessage)
}

export const sendMessage = (destination: string, body: any) => {
  if (stompClient && stompClient.connected) {
    stompClient.publish({ destination, body: JSON.stringify(body) })
  }
}

export const disconnectWebSocket = () => {
  stompClient?.deactivate()
}
