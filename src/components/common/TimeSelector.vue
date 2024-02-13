<script setup>
import { toRefs, ref, watch } from 'vue';
import { useField } from 'vee-validate';

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
  minHourTime: {
    type: Number,
    default: 0,
  },
  minMinuteTime: {
    type: Number,
    default: 0,
  },
  boardingDateChenge: {
    type: Boolean,
    default: false,
  },
  startTimeChenge: {
    type: Boolean,
    default: false,
  },
});
const {
  name, rules, label, class: classRef, disabled, inputClass, minHourTime, minMinuteTime, boardingDateChenge, startTimeChenge,
} = toRefs(props);

const {
  handleChange, errorMessage, value: inputValue, meta,
// eslint-disable-next-line vue/no-setup-props-destructure
} = useField(name, rules, {
  initialValue: props.modelValue,
  label,
});

const emits = defineEmits(['update-time']);

const startTime = ref({ hours: minHourTime, minutes: minMinuteTime });

// 如果上車時間變更就把居服欄位清空
watch(boardingDateChenge, () => {
  inputValue.value = '';
});

// 如果上車時間變更就把居服欄位清空
watch(startTimeChenge, () => {
  inputValue.value = '';
});

</script>

<template>
  <span  :class="classRef" class="relative ml-10px">
    <p v-if="label" class="mb-2 block text-left text-main_orange relative before:absolute before:left--10px before:top-6px before:content-[''] before:bg-main_orange before:w-5px before:h-15px before:rounded-100px ">{{ label }}</p>
    <Datepicker
      @closed="emits('update-time')"
      auto-apply
      v-model="inputValue"
      :placeholder="placeholder"
      time-picker
      cancelText="取消"
      selectText="確定"
      locale="zh-TW"
      :min-time="{ hours: minHourTime, minutes: minMinuteTime }"
      minutes-increment="15"
      minutes-grid-increment="15"
      :start-time="startTime"
      model-type="HH:mm"
    >
      <template #dp-input="{ value }">
      <div class="flex items-center border-b border-main_orange bg-white relative overflow-hidden ">
        <input
          @change="handleChange"
          :value="value"
          :disabled="disabled"
          readonly
          type="text"
          :placeholder="placeholder"
          class="min-h-32px h-80% py-8px w-full cursor-pointer bg-white pl-2 placeholder:text-sm placeholder:text-black/50 focus:outline-none"
          :class="[{' !bg-red-50': !!errorMessage, ' !bg-green-50': meta.validated && !disabled,'!bg-gray-100': disabled}, inputClass]"
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
