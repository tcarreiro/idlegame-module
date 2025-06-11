<script setup lang="ts">
  import { useBorderDrawer } from "@/composable/BorderDrawer.composable";
  import { Container, Texture, TilingSprite, Rectangle, Graphics } from "pixi.js";
  import { onMounted, ref, watch, type Ref } from "vue";
  import { v4 as uuidv4 } from "uuid";
  import type { BorderStyle } from "@/models/styles.model";

  export type MContainerProps = {
    backgroundTexture?: Texture|null;
    border?:BorderStyle;
  };

  const props = withDefaults(defineProps<MContainerProps>(), {
    backgroundTexture:null,
    border: "none",
  });

  const containerRect:Ref<Rectangle> = defineModel<Rectangle>({required:true});

  const borderDrawer = useBorderDrawer();

  let elementId: string = "";
  const containerRef = ref<Graphics | null>(null);

  watch(containerRect, (newRect) => {
    if (newRect) {
      borderDrawer.handleBorder(containerRect.value, containerRef.value as Graphics, props.border);
    }
  });

  onMounted(() => {
    elementId = `container-${uuidv4()}`;
    borderDrawer.handleBorder(containerRect.value, containerRef.value as Graphics, props.border);
  });

</script>

<template>
  <Container :position="[containerRect.x, containerRect.y]"  >
    <TilingSprite
      :texture="props.backgroundTexture"
      :width="containerRect.width"
      :height="containerRect.height"
    >
    <slot></slot>
    </TilingSprite>
    <Graphics ref="containerRef" />
  </Container>
</template>
