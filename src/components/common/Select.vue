<script setup>
import { useField } from 'vee-validate';
import { toRef, toRefs, watch } from 'vue';

const props = defineProps({
  modelValue: {
    type: null,
    default: null,
  },
  items: {
    type: Array,
    default: () => [],
  },
  value: {
    type: String,
    default: '',
  },
  name: {
    type: String,
  },
  rules: {
    type: [Object, String],
    default: undefined,
  },
  label: {
    type: String,
  },
  placeholder: {
    type: String,
    default: '',
  },
  class: {
    type: String,
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  disabledDefault: {
    type: Boolean,
    default: false,
  },
  disabledOption: {
    type: String,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
  inputClass: {
    type: String,
  },
  itemLabel: {
    type: String,
    default: 'description',
  },
  showLabel: {
    type: Boolean,
    default: true,
  },
  itemKey: {
    type: String,
    default: 'id',
  },
});
const { itemLabel, itemKey } = toRefs(props);
const nameRef = toRef(props, 'name');
const rules = toRef(props, 'rules');
const labelRef = toRef(props, 'label');
const classRef = toRef(props, 'class');
const disabledRef = toRef(props, 'disabled');
const disabledOptionRef = toRef(props, 'disabledOption');
const readonlyRef = toRef(props, 'readonly');
const inputClassRef = toRef(props, 'inputClass');
const itemsRef = toRef(props, 'items');
const modelValueRef = toRef(props, 'modelValue');
const showLabelRef = toRef(props, 'showLabel');
const valueRef = toRef(props, 'value');

const {
  value: inputValue,
  errorMessage,
  handleChange,
} = useField(nameRef, rules, {
  initialValue: modelValueRef,
  label: labelRef,
});

// 上車地區高雄服務類別減少，所以如果是高雄就清空服務類別欄位
watch(valueRef, () => {
  if (valueRef.value === '高雄') {
    inputValue.value = '';
  }
});

</script>

<template>
  <label :for="nameRef" :class="classRef" class=" mb-30px ml-10px ">
    <p v-if="showLabelRef" class="mb-2 block text-left text-main_orange relative before:absolute before:left--10px before:top-6px before:content-[''] before:bg-main_orange before:w-5px before:h-15px before:rounded-100px ">{{labelRef}}</p>
    <div
      :class="[{' !bg-red-50': !!errorMessage,'!bg-gray-100': disabledRef}, inputClassRef]"
      class=" flex items-center border-b border-main_orange bg-white relative overflow-hidden "
    >
    <select
      @input="handleChange"
      :id="nameRef"
      :name="nameRef"
      :value="inputValue"
      :placeholder="placeholder"
      :disabled="disabledRef"
      :readonly="readonlyRef" class="block w-full border-0 bg-transparent p-2 text-sm outline-none focus:border-0">
      <option value="" :disabled="disabledDefault">請選擇</option>
      <template v-for="(moduleItem, index) in itemsRef" :key="index">
        <option :value="moduleItem[itemKey]" :disabled="moduleItem[disabledOptionRef]">{{moduleItem[itemLabel]}}</option>
      </template>
    </select>
    </div>
    <transition name="fade">
      <p v-if="errorMessage" class="mt-2 text-left text-sm text-red-600 dark:text-red-500"><span class="font-medium">{{errorMessage}}</span> </p>
    </transition>

  </label>
</template>
