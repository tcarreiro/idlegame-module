<script setup lang="ts">
import MBorder from './MBorder.vue';

type MInputProps = {
  placeholder?:string,
}
const props = withDefaults(defineProps<MInputProps>(),{
  placeholder:"",
});

const inputValue = defineModel();

const emit = defineEmits(["change"]);

</script>

<template>
  <input
    class="noise-container input"
    v-model="inputValue"
    :placeholder="props.placeholder"
    @input="emit('change')"
  />
</template>

<style scoped lang="scss">
.input {
  background-color: rgba($color: var(--color-grey-75), $alpha: 0.7);
  border: 1px solid rgb(var(--color-grey-75));
  color: #ccc;
}
</style>
