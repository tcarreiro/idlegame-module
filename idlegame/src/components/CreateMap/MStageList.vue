<script setup lang="ts">
import { ref, type Ref } from 'vue';
import MBorder from '../basic/MBorder.vue';

const choosenStage = defineModel<String>({required:true});
const availableStages = defineModel<Array<String>>("stageList",{required:true});

</script>

<template>
  <MBorder v-if="availableStages.length" class="noise-container h-full divided-content" thickness="thin">
    <div class="created-maps">
      <li v-for="opt in availableStages" class="pl-2 pr-5" :class="opt === choosenStage?'selected':''" @click="choosenStage=opt">{{opt}}</li>
    </div>
  </MBorder>
  <div v-else>
    Nada encontrado...
  </div>
  <MBorder v-if="availableStages.length" class="noise-container h-full divided-content" thickness="thin">
    <div class="created-maps">
      TODO: Preview
    </div>
  </MBorder>
</template>

<style scoped lang="scss">

.divided-content {
  width: calc(50% - 0.5rem);
}

.created-maps {
  padding:0.5rem;
  background-color: rgba(0, 0, 0, $alpha: .4);
  color:#ccc;
  min-height: 90%;

  li {
    list-style: none;
    cursor: pointer;
    width: fit-content;

    &.selected {
      background-color: rgba(var(--color-blue-50), $alpha: .4);
    }
  }
}
</style>
