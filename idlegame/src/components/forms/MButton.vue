<script setup lang="ts">

type MButtonProps = {
  label?:string,
  icon?:string,
  secondary?:boolean,
  accent?:boolean,
}
const props = withDefaults(defineProps<MButtonProps>(),{
  label:"",
  icon:"",
  secondary:false,
});

const emit = defineEmits(["click"]);

</script>

<template>
  <button
    type="button"
    :class="`noise-container ${props.secondary?'secondary':'primary'} ${props.accent?'accent':''}`"
    @click="emit('click')"
  >
  <i v-if="props.icon"></i>
  <span class="no-select">{{ props.label }}</span>
  </button>
</template>

<style scoped lang="scss">
.primary {
  background-color: rgba($color: var(--color-green-50), $alpha: 0.7);
  border-top: 1px solid rgb(var(--color-green-25));
  border-left: 1px solid rgb(var(--color-green-25));
  border-right: 1px solid rgb(var(--color-green-75));
  border-bottom: 1px solid rgb(var(--color-green-75));
  color: #ccc;
  cursor: pointer;

  &.accent {
    background-color: rgba($color: var(--color-blue-50), $alpha: 0.7);
    border-top: 1px solid rgb(var(--color-blue-25));
    border-left: 1px solid rgb(var(--color-blue-25));
    border-right: 1px solid rgb(var(--color-blue-75));
    border-bottom: 1px solid rgb(var(--color-blue-75));
  }
}

.secondary {
  background-color: rgba($color: var(--color-grey-50), $alpha: 0.7);
  border-top: 1px solid rgb(var(--color-grey-25));
  border-left: 1px solid rgb(var(--color-grey-25));
  border-right: 1px solid rgb(var(--color-grey-75));
  border-bottom: 1px solid rgb(var(--color-grey-75));
  color: #ccc;
  cursor: pointer;

  &.accent {
    background-color: rgba($color: var(--color-blue-50), $alpha: 0.7);
    border-top: 1px solid rgb(var(--color-blue-25));
    border-left: 1px solid rgb(var(--color-blue-25));
    border-right: 1px solid rgb(var(--color-blue-75));
    border-bottom: 1px solid rgb(var(--color-blue-75));
  }
}

button:disabled {
  opacity: 0.9;
  filter: grayscale(70%);
  cursor: auto;
}

button:not(:disabled):hover {
  filter: brightness(110%);
}

button:not(:disabled):active {
  filter: brightness(90%);
  transform: scale(0.98);
}
</style>
