<script setup lang="ts">
  import { useBorderDrawer } from '@/composable/BorderDrawer.composable';
import type { BorderStyle } from '@/models/styles.model';
  import { Input } from '@pixi/ui';
  import { Application, Graphics, Rectangle, TextStyle, Texture } from 'pixi.js';
  import { computed, inject, nextTick, onMounted, ref, watch, watchEffect } from 'vue';
  import { appInjectKey } from 'vue3-pixi';

  type BaseInput = {
    inputRect?:Rectangle;
    placeholder?:string;
    placeholderColor?:string;
    textColor?:string;
    textSize?:number;
    backgroundTexture?:Texture|null;
    border?:BorderStyle;
  };

  const props = withDefaults(defineProps<BaseInput>(), {
    inputRect: () => new Rectangle(0, 0, 200, 20),
    placeholder:"",
    placeholderColor:"#000000",
    textColor:"#000000",
    textSize:14,
    backgroundTexture: null,
    border: "none",
  });

  const modelValue = defineModel<string>()
  const emit = defineEmits(["update:modelValue"])
  const inputRef = ref<Input>()
  const borderDrawer = useBorderDrawer();
  const pixiApp = computed(()=>inject<Application>(appInjectKey));


  const drawInput=():Graphics => {
    const graphics = new Graphics();
    const texture = props.backgroundTexture;
    graphics.clear();
    if (texture) graphics.beginTextureFill({ texture });
    graphics.drawRect(0,0, props.inputRect.width, props.inputRect.height);
    borderDrawer.handleBorder(props.inputRect, graphics, "simple");
    graphics.endFill();
    return graphics;
  };

  const stageObject = async (input: Input) => {
    await nextTick();
    if (pixiApp.value) {
      pixiApp.value.stage.addChild(input);
    }
  };

  onMounted(async() => {
    const graphics = drawInput();

    const textStyle = new TextStyle({
      fill: props.textColor,
      fontSize: props.textSize,
    });

    const input = new Input({
      bg: graphics,
      textStyle,
      padding: 0,
      maxLength: 100,
      placeholder: props.placeholder,
    });
    input.x = props.inputRect.x;
    input.y = props.inputRect.y;

    input.onChange.connect((val: string) => {
      emit('update:modelValue', val);
    });

    if (modelValue.value) {
      input.value = modelValue.value
    };

    inputRef.value = input;
    await stageObject(input);

  });

  watch(modelValue, (newVal) => {
    if (inputRef.value && inputRef.value.value !== newVal) {
      inputRef.value.value = newVal || ""
    }
  });


</script>
