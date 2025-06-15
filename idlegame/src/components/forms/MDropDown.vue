<script setup lang="ts">
import Dropdown from 'primevue/dropdown';

export type MDropDownItem = {
  label: string;
  value: number|string|boolean;
}

export type MDropDownGroup = {
  label: string;
  category?:string;
  items: Array<MDropDownItem>;
}

type MDropDownProps = {
  options?:Array<MDropDownGroup>|Array<MDropDownItem>;
  placeholder?:string;
  type?:"group"|"simple";
}

const props = withDefaults(defineProps<MDropDownProps>(),{
  options: ()=>[],
  placeholder: "",
  type: "simple",
});

const selection = defineModel<MDropDownItem|null>();

</script>

<template>
  <Dropdown
    class="p-dropdown"
    v-model="selection"
    :options="props.options"
    optionLabel="label"
    :placeholder="props.placeholder"
    :optionGroupChildren="`${props.type==='group'?'items':''}`"
    :optionGroupLabel="`${props.type==='group'?'label':''}`"
  >
    <template #optiongroup="slotProps">
      <div class="flex align-items-center">
        <div>{{ slotProps.option.label }}</div>
      </div>
    </template>
    <template #option="slotProps">
      <div class="flex align-items-center">
        <div>{{ slotProps.option.label }}</div>
      </div>
    </template>
  </Dropdown>
</template>

<style scoped lang="scss">
.p-dropdown {
  min-width: 90%;
  background-color: rgba($color: var(--color-grey-75), $alpha: 0.7);
  border: 1px solid rgb(var(--color-grey-75));
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0.75rem;
  cursor: pointer;
  height: 2rem;
}

:deep(.p-inputtext) {
  color: #ccc;
}
</style>
