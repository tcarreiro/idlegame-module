<script setup lang="ts">
  import { Application } from "pixi.js";
  import { appInjectKey, createApp } from 'vue3-pixi';
  import GameCanvasView from "@/views/GameCanvasView.vue";

  const pixiApp = new Application({
    resizeTo: window,
    background: '#111',
    antialias: true,
  });

  document.body.appendChild(pixiApp.view as any)

  const app = createApp(GameCanvasView)

  app.mount(pixiApp.stage)
  app.provide(appInjectKey, pixiApp)

</script>
