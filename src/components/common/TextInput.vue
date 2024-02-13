<script setup>
import { useField } from 'vee-validate';
import { toRef, useSlots } from 'vue';

const slots = useSlots();

defineEmits(['update:modelValue', 'closeBtnGeo', 'searchFromGeo']);

const props = defineProps({
  type: {
    type: [String, Number],
    default: 'text',
  },
  value: {
    type: String,
    default: '',
  },
  modelValue: {
    type: [String, Number],
  },
  name: {
    type: String,
    required: true,
  },
  rules: {
    type: [Object, String, Array, Function],
    default: undefined,
  },
  label: {
    type: String,
  },
  successMessage: {
    type: String,
    default: '',
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
  readonly: {
    type: Boolean,
    default: false,
  },
  maxLength: {
    type: Number,
  },
  inputClass: {
    type: String,
  },
  min: {
    type: Number,
    default: 0,
  },
  max: {
    type: Number,
  },
  showLabel: {
    type: Boolean,
    default: true,
  },
  isTrim: {
    type: Boolean,
    default: false,
  },
  isClose: {
    type: Boolean,
    default: true,
  },
  clearParentArray: {
    type: Function,
  },
});

const valueRef = toRef(props, 'value');
const nameRef = toRef(props, 'name');
const typeRef = toRef(props, 'type');
const rules = toRef(props, 'rules');
const labelRef = toRef(props, 'label');
const classRef = toRef(props, 'class');
const disabledRef = toRef(props, 'disabled');
const readonlyRef = toRef(props, 'readonly');
const maxLengthRef = toRef(props, 'maxLength');
const inputClassRef = toRef(props, 'inputClass');
const minRef = toRef(props, 'min');
const maxRef = toRef(props, 'max');
const showLabelRef = toRef(props, 'showLabel');
const isCloseRef = toRef(props, 'isClose');
// eslint-disable-next-line no-unused-vars
const isTrimRef = toRef(props, 'isTrim');

const {
  value: inputValue,
  errorMessage,
  // eslint-disable-next-line no-unused-vars
  // handleChange,
} = useField(nameRef, rules, {
  initialValue: valueRef.value,
  label: labelRef,
  syncVModel: true,
});

</script>

<template>
  <div class=" relative  mb-30px ml-10px  " :class="classRef">
    <label :for="nameRef">
      <div @click=" inputValue = ''; $emit('closeBtnGeo') "
        :class=" inputValue !== '' && isCloseRef ? `relative cursor-pointer after:absolute after:top-45px after:right-10px after:content-[''] after:w-18px after:h-18px after:bg-[url(/public/images/concelBtn.svg)] after:z-10`: '' ">
      </div>
      <p v-if="showLabelRef" class="mb-2 block text-left text-main_orange relative before:absolute before:left--10px before:top-6px before:content-[''] before:bg-main_orange before:w-5px before:h-15px before:rounded-100px ">{{labelRef}}</p>
      <div
        :class="[{' !bg-red-50': !!errorMessage,'!bg-gray-100': disabledRef}, inputClassRef]"
        class=" flex items-center border-b border-main_orange bg-white relative overflow-hidden "
      >
        <span v-if="slots['frontIcon']" class="ml-2 inline-block">
          <slot name="frontIcon"></slot>
        </span>
        <input
          v-model="inputValue"
          @input="$emit('searchFromGeo')"
          :id="nameRef"
          :name="nameRef"
          :type="typeRef"
          :placeholder="placeholder"
          :disabled="disabledRef"
          :readonly="readonlyRef"
          :maxlength="maxLengthRef"
          :min="minRef"
          :max="maxRef"
          autocomplete="on"
          class="block w-full border-0 bg-transparent p-2 text-sm outline-none focus:border-0"
        >
        <span v-if="slots['backIcon']" class="mr-2 flex gap-2">
          <slot name="backIcon"></slot>
        </span>
        <span v-if="slots['close']" class="mr-2 flex gap-2">
          <slot name="close"></slot>
        </span>
      </div>
      <slot name="button" />
      <transition name="fade">
        <p v-if="errorMessage" class="mt-2 text-left text-sm text-red-600 dark:text-red-500"><span class="font-medium">{{errorMessage}}</span> </p>
      </transition>

    </label>
    <slot name="serachLocal"></slot>
  </div>
</template>
