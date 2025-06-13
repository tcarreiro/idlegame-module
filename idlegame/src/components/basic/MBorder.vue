<script setup lang="ts">
type MBorderProps = {
  inverted?:boolean;
  thickness?:"thick"|"thin";
}
const props = withDefaults(defineProps<MBorderProps>(),{
  inverted:false,
  thickness:"thin"
});
</script>

<template>
  <div :class="`${props.thickness}-border${props.inverted?'-inverted':''}`">
    <div :class="`${props.thickness}-border${props.inverted?'':'-inverted'}${props.thickness==='thin'?'__':''} h-full`">
      <slot></slot>
    </div>
  </div>
</template>
