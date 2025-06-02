<script setup lang="ts">

import { ref, onMounted, onUnmounted, type Ref } from "vue";
import { connectWebSocket, subscribe, sendMessage, disconnectWebSocket } from "@/services/websocket";

const messages:Ref<Array<string>> = ref<string[]>([]);

onMounted(() => {
  connectWebSocket(
    (msg) => {
      messages.value.push(msg.body);
    },
    () => {
      subscribe("/topic/greetings", (msg) => {
        messages.value.push("📨 " + msg.body);
      });

      sendMessage("/app/hello", { content: "Olá do frontend!" });
    }
  );
});

onUnmounted(() => {
  disconnectWebSocket();
});

</script>

<template>
  <div>
    <h2>Mensagens do WebSocket:</h2>
    <ul>
      <li v-for="(msg, idx) in messages" :key="idx">{{ msg }}</li>
    </ul>
  </div>
</template>
