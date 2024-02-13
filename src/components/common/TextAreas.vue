<script setup>
import { useField } from 'vee-validate';
import { toRef, useSlots } from 'vue';

const slots = useSlots();

const props = defineProps({
  type: {
    type: String,
    default: 'text',
  },
  value: {
    type: String,
    default: '',
  },
  modelValue: {
    type: String,
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
  <label :for="nameRef" :class="classRef" class=" mb-30px ml-10px ">
    <p v-if="showLabelRef" class="mb-2 block text-left text-main_orange relative before:absolute before:left--10px before:top-6px before:content-[''] before:bg-main_orange before:w-5px before:h-15px before:rounded-100px ">{{labelRef}}</p>
    <div
      :class="[{' !bg-red-50': !!errorMessage,'!bg-gray-100': disabledRef}, inputClassRef]"
      class=" flex items-center rounded-md border border-#C8C8C8 bg-white "
    >
      <span v-if="slots['frontIcon']" class="ml-2 inline-block">
        <slot name="frontIcon"></slot>
      </span>
      <textarea
        v-model="inputValue"
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
        class="block w-full h-100px border-0 bg-transparent p-2 text-sm outline-none focus:border-0"
      ></textarea>
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
</template>
