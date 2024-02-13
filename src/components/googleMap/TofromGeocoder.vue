<script setup>
import {
  inject, onMounted, ref, toRef, useSlots,
} from 'vue';
import { useField } from 'vee-validate';

const slots = useSlots();

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
  // handleChange,
} = useField(nameRef, rules, {
  initialValue: valueRef.value,
  label: labelRef,
  syncVModel: true,
});

// 取得經緯度後向父層傳遞
const emit = defineEmits(['toGeocod']);

/** @const 存放地址經緯度 */
let toGeocodList;

/** @func 初始化googleAPI實例 */
const Loader = inject('$Loader');

/** @func 存放初始化後的googleAPI實例 */
const google = ref(null);

/** @func 存放geocoderAPI實例 */
const geocoder = ref(null);

/** @func 存放AutocompleteServiceAPI實例 */
const autocomplete = ref(null);

/** @array 存放autocomplete列表  */
const searchGeAutocompletetList = ref([]);

/** @func googleAPI初始化設定 */
const initMap = async () => {
  const loader = new Loader({
    apiKey: 'AIzaSyCaJkAtzy1RV7AYt4wuLWRUcBvfnyKuckI', // This must be set in nuxt.config.js
    version: 'weekly',
    language: 'zh-TW',
    // places = 輸入框設定
    libraries: ['places', 'geometry'],
    // libraries: ['places', 'drawing', 'geometry'] // Optional GM libraries to load
    mapIds: ['TTGO'],
  });

  google.value = await loader.load();
  autocomplete.value = new google.value.maps.places.AutocompleteService();
  geocoder.value = new google.value.maps.Geocoder();
};

/** @func 刪除爛位內容&清空地址列表 */
function closeBtn() {
  inputValue.value = '';
  searchGeAutocompletetList.value = [];
  emit('toGeocod', false);
}

/** @func autocomplete產生模糊查詢地址列表 */
function searchLocalList() {
  const googleSearchOption = {
    input: inputValue.value,
    language: 'zh-TW',
    componentRestrictions: { country: 'TW' },
  };
  emit('toGeocod', false);
  autocomplete.value.getPlacePredictions(googleSearchOption, (results, status) => {
    if (status === 'OK') {
      searchGeAutocompletetList.value = results;
    }
  });
}

/** @func 選取地址取得經緯度 */
function getGeocoder(address) {
  searchGeAutocompletetList.value = [];
  inputValue.value = address;

  geocoder.value.geocode({ address, componentRestrictions: { country: 'TW' } }, (results, status) => {
    if (status === 'OK') {
      toGeocodList = {
        fromLat: results[0].geometry.location.lat(),
        fromLng: results[0].geometry.location.lng(),
      };
      emit('toGeocod', toGeocodList);
    } else {
      console.log('地址格式錯誤');
    }
  });
}

onMounted(async () => {
/** @func 初始化googleAPI */
  await initMap();
});
</script>

<template>
  <div class=" relative  mb-30px ml-10px  " :class="classRef">
    <label :for="nameRef">
      <div @click="closeBtn "
        :class=" inputValue !== '' ? `relative cursor-pointer after:absolute after:top-45px after:right-10px after:content-[''] after:w-18px after:h-18px after:bg-[url(public/images/concelBtn.svg)] after:z-10`: '' ">
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
          @input="searchLocalList"
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
          class="block w-full border-0 bg-transparent p-2 text-sm outline-none "
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
    <!-- 地圖設定地點、目前位置、上下車實際地點 -->
    <section v-if="searchGeAutocompletetList.length > 0" class="absolute z-10 top-80px grid gap-8px p-10px bg-#fff border-2px border-solid rounded-10px cursor-pointer ">
      <p class=" text-center text-#666666 ">搜尋結果 - 請選擇地點</p>
      <div v-for=" (item, index) in searchGeAutocompletetList " :key="index">
        <div @click=" getGeocoder(item.description) " class=" hover:text-#097494 ">{{ item.description }}</div>
      </div>
    </section>
  </div>
</template>
