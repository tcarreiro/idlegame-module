<script setup lang="ts">
type MBorderProps = {
  inverted?:boolean;
  thickness?:"thick"|"thin";
  simple?:boolean;
  contentClass?:string;
}
const props = withDefaults(defineProps<MBorderProps>(),{
  inverted:false,
  thickness:"thin",
  simple:false,
  contentClass:"",
});
</script>

<template>
  <div :class="`${props.thickness}-border${props.inverted?'-inverted':''}`">
    <div :class="`${props.thickness}-border${props.inverted?'':'-inverted'}${props.thickness==='thin'?'__':''} h-full w-full ${props.simple?'hide-border':''} ${props.contentClass}`">
      <slot></slot>
    </div>
  </div>
</template>
