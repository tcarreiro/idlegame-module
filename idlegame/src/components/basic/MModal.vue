<script setup lang="ts">
import MButton from '../forms/MButton.vue';
import MBorder from './MBorder.vue';
import MSeparator from './MSeparator.vue';

type MModalProps = {
  title?:string;
  needsAction?:boolean;
}
const props = withDefaults(defineProps<MModalProps>(),{
  title:"",
  needsAction:false,
});

const showModal = defineModel<boolean>("show",{required:true})

const emit = defineEmits(["close", "accept"]);

const closeModal = () => {
  showModal.value = false;
  emit("close");
}

const acceptModal = () => {
  showModal.value = false;
  emit("accept");
}

</script>

<template>
  <dialog open class="custom-modal" v-if="showModal">
    <MBorder simple class="noise-container" thickness="thick">
      <div class="modal-container ">
        <header class="modal-header noise-container">
          <span class="modal-title">{{props.title}}</span>
        </header>

        <MBorder class="noise-container flex w-full" thickness="thin">
          <div class="modal-content h-full ">
            <slot name="content"></slot>
          </div>

          <MSeparator/>
          <footer class="modal-actions">
            <MButton v-if="props.needsAction" primary class="pt-2 pb-2 pl-3 pr-3" label="Ok" @click="acceptModal()" />
            <MButton secondary class="pt-2 pb-2 pl-3 pr-3" label="Fechar" @click="closeModal()" />
          </footer>
        </MBorder>
      </div>
    </MBorder>
  </dialog>
</template>

<style lang="scss">
.custom-modal {
  border: none;
  padding: 0;
  background: rgba(0, 0, 0, 0.5); /* overlay */
  width: 100vw;
  height: 100vh;
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50000;
}

.modal-container {
  max-height: 80vh;
  width: 600px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.modal-title {
  color: var(--light-text-color);
}

.modal-header {
  padding-left: 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--medium-border);
}

.modal-content {
  display: flex;
  flex-direction: column;
  min-height: 150px;
  padding: 1rem;
  overflow-y: auto;
  flex-grow: 1;
}

.modal-actions {
  padding: 1rem;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.close-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  line-height: 1;
  cursor: pointer;
}
</style>
