<script setup>
import {
  toRefs, ref, inject, computed,
} from 'vue';
import { useField } from 'vee-validate';

/** @Object 時間方法處理 */
const dayjs = inject('$dayjs');

const props = defineProps({
  modelValue: {
    type: null,
    default: null,
  },
  value: {
    type: null,
    default: null,
  },
  name: {
    type: String,
    default: '',
  },
  rules: {
    type: [Object, String],
    default: undefined,
  },
  label: {
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
  inputClass: {
    type: String,
  },
  isShowErrMsg: {
    type: Boolean,
    default: true,
  },
  placeholder: {
    type: String,
    default: '',
  },
  mintime: {
    type: Number,
    default: 0,
  },
  maxtime: {
    type: Number,
    default: 23,
  },
  consecutiveHolidays: {
    type: Array,
  },
});
const {
  name, rules, label, class: classRef, disabled, inputClass, mintime,
} = toRefs(props);

const {
  handleChange, errorMessage, value: inputValue,
// eslint-disable-next-line vue/no-setup-props-destructure
} = useField(name, rules, {
  initialValue: props.modelValue,
  label,
});

const emits = defineEmits(['update-time']);

const startTime = ref({ hours: 0, minutes: 0 });

/** @func 訂車需三天前預訂日期 */
const minDate = computed(() => {
  const today = new Date();
  const charterDate = new Date(today);
  charterDate.setDate(charterDate.getDate() + 3);
  return charterDate;
});

</script>

<template>
  <span  :class="classRef" class="relative ml-10px mb-30px ">
    <p v-if="label" class="mb-2 block text-left text-main_orange relative before:absolute before:left--10px before:top-6px before:content-[''] before:bg-main_orange before:w-5px before:h-15px before:rounded-100px ">{{ label }}</p>
    <Datepicker
      @closed="emits('update-time')"
      auto-apply
      :min-date="minDate"
      v-model="inputValue"
      :placeholder="placeholder"
      cancelText="取消"
      selectText="確定"
      locale="zh-TW"
      time-picker-inline
      :min-time="{ hours: mintime, minutes: 0 }"
      :start-time="startTime"
      minutes-increment="15"
      minutes-grid-increment="15"
    >
      <template #dp-input="{ value }">
        <div class="flex items-center border-b border-main_orange bg-white relative overflow-hidden ">
          <input
            @change="handleChange"
            :value=" name === 'birthday' && inputValue !== null ? dayjs(value).format('YYYY/MM/DD') : value"
            :disabled="disabled"
            type="text"
            :placeholder="placeholder"
            class="min-h-32px h-80% py-8px w-full cursor-pointer bg-white pl-2 placeholder:text-sm placeholder:text-black/50 focus:outline-none"
            :class="[{' !bg-red-50': !!errorMessage}, inputClass]"
          >
        </div>
      </template>
    </Datepicker>
    <transition name="fade">
      <p v-if="errorMessage && isShowErrMsg" class="mt-2 text-left text-sm text-red-600 dark:text-red-500"><span class="font-medium">{{errorMessage}}</span> </p>
    </transition>
  </span>
</template>

<style scoped>
:deep(.dp__outer_menu_wrap .dp__menu ) {
  z-index: 10;
}

:deep(.dp__outer_menu_wrap .dp__select, .dp__cancel ) {
  font-weight: 500;
}

:deep(.dp__outer_menu_wrap .dp__select ) {
  color: #1E3E8F;
}

:deep(.dp__outer_menu_wrap .dp__action_button ) {
  height: unset;
  white-space: nowrap;
}

:deep(.dp__outer_menu_wrap .dp__action_select ) {
  --dp-primary-color: #1976d2;
  background-color: var(--dp-primary-color) !important;
}

</style>
