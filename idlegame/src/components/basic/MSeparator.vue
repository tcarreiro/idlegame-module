<script setup lang="ts">
type MBorderProps = {
  inverted?:boolean;
}
const props = withDefaults(defineProps<MBorderProps>(),{
  inverted:false,
});
</script>

<template>
  <div :class="`thin-border${props.inverted?'-inverted':''} separator`">
  </div>
</template>

<style>
.separator {
  border-left: 0;
  border-right: 0;
  width: calc(100% - 2rem);
  margin: 0 auto;
  display: block;
}
</style>
