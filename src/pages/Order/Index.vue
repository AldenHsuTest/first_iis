<script setup>
import {
  ref, computed, inject, watch, onMounted,
} from 'vue';
import { useRouter } from 'vue-router';
import { useForm } from 'vee-validate';
import { storeToRefs } from 'pinia';
import qs from 'qs';
import axios from 'axios';
import { setupUserAuthStore } from '@/stores';
import { SET_COOKIES, REMOVE_COOKIES } from '@/utils/js-cookie';
import TextInput from '@/components/common/TextInput.vue';
import Select from '@/components/common/Select.vue';
import UserTitle from '@/components/UserTitle.vue';
import TimeSelector from '@/components/common/TimeSelector.vue';
import DateSelector from '@/components/common/DateSelector.vue';
import TextAreas from '@/components/common/TextAreas.vue';
import Button from '@/components/common/Button.vue';
import { FETCH_AUTH, FETCH_AUTH_ORDER } from '@/service';
import {
  initMap, searchLocalList, getGeocoder,
} from '@/composables/googlemap';

const router = useRouter();

const swal = inject('$swal');

const userToken = ref('');

// 時間處理方法
const dayjs = inject('$dayjs');

/** @const {object} 自建的Pinia方法( 存放使用者資訊 ) */
const AuthInfo = setupUserAuthStore();

/** @const {object} Pinaia使用者資訊響應處理 */
const { AllUserInfo, userAccessToken } = storeToRefs(AuthInfo);

/** @const {object} 使用者資訊 */
const UserInfo = AllUserInfo;

/** @const {array} 將接駁服務list存起來等待預約訂單頁面新增資料使用 */
const orderList = ref([]);

/** @const {boolean} 切換頁面判斷 */
const orderPage = ref(true);

/** @const {string} 服務類別名稱 */
const serviceTypeName = ref('');

/** @const {number} 訂單點對點金額 */
const transportationAmt = ref(0);

/** @const {number} 訂單包車金額 */
const charterAmt = ref(0);

/** @const {number} 訂單爬梯機金額 */
const floorAmt = ref(0);

/** @const {number} 訂單居服金額 */
const serviceAmt = ref(0);

/** @const {number} 訂單總金額 */
const totalAmt = ref(0);

/** @const {number} 計算包車服務是否符合規則 */
const charterHoursRuleValue = ref(null);

/** @const {boolean} 訂車日期是否為連續假日 */
const getOnRule = ref(false);

/** @const {string}  上車地點驗證是否與上車地區相同 */
const boardingArea = ref('');

/** @const {number} 居服服務時數 */
const totalHours = ref(0);

/** @const {boolean} 上車日期變動就反向變更布林值 */
const boardingDateProp = ref(false);

/** @const {boolean} 居服起始時間變動變動就反向變更布林值 */
const startTimeProp = ref(false);

/* googleAPI相關( 取得經緯度、模糊查詢地址列表 ) 開始 */
/** @const {array} 上車經緯度 */
let fromGeocodList;

/** @const {array} 下車經緯度 */
let toGeocodList;

/** @const {array} 經緯度API發送用資料 */
const sendLatLng = ref([]);

/** @func googleMap初始化 */
const { autocomplete, geocoder } = initMap();

/** @const {string} 選擇上車地點 */
const fromGeoAddress = ref('');

/** @const {string} 選擇上車地點 */
const toGeoAddress = ref('');

/** @const {boolean} 上車地點輸入disable切換 */
const fromGeoDisable = ref(false);

/** @const {boolean} 下車地點輸入disable切換 */
const toGeoDisable = ref(false);

/** @const {array} google模糊搜尋列表 */
const fromGeoList = ref([]);

/** @const {array} google模糊搜尋列表 */
const toGeoList = ref([]);
/* googleAPI相關( 取得經緯度、模糊查詢地址列表 ) 結束 */

/** @const {array} 國定假日 */
const Holiday = ref([]);

/** @const {number} 上下車行程時間 */
const gapTime = ref(0);

/** @const {number} 居服起始小時 */
const homeStartHour = ref(0);

/** @const {number} 居服起始分鐘 */
const homeStartMinute = ref(0);

/** @const {number} 居服結束小時 */
const homeEndHour = ref(0);

/** @const {number} 居服結束分鐘 */
const homeEndMinute = ref(0);

/** @const {string} 預估移動時間 */
const movingTime = ref('');

/** @const {string} 樓層vee-valide 驗證用 */
const floorRequired = ref('');

/** @const {string} 驗證碼vee-valide 驗證用 */
const codeRequired = ref('');

/** @const {string} 居服vee-valide 驗證用 */
const homeServeRequired = ref('');

/** @const {boolean} 如果Holiday非同步請求完成就變true  */
const isHolidayDataLoaded = ref(false);

/** @const {arrat} 組織列表 */
const organizeList = ref([]);

/** @const {arrat} 被選擇的組織 */
const organizeName = ref([]);

/** @const {object} 服務區域 */
const serviceArea = ref([
  { id: '新北', label: '新北' },
  { id: '台北', label: '台北' },
  { id: '高雄', label: '高雄' },
  { id: '台東', label: '台東' },
  { id: '台中', label: '台中' },
]);

/** @const {object} 服務類別 */
const serviceType = ref([
  { id: 1, label: '交通接送' },
  { id: 2, label: '包車接送' },
  { id: 4, label: '交通與居服服務' },
]);

/** @const {object} 服務類別 */
const serviceTypeAll = ref([
  { id: 1, label: '交通接送' },
  { id: 2, label: '包車接送' },
  { id: 3, label: '交通與爬梯機', disabled: true },
  { id: 4, label: '交通與居服服務' },
  { id: 5, label: '交通與爬梯機與居服', disabled: true },
]);

/** @const {object} 輪椅種類 */
const wheelchairType = ref([
  { id: '一般座椅', label: '一般座椅' },
  { id: '普通輪椅', label: '普通輪椅' },
  { id: '高背輪椅', label: '高背輪椅' },
  { id: '電動輪椅', label: '電動輪椅' },
  { id: '電動高背輪椅', label: '電動高背輪椅' },
]);

/** @const {object} 陪同人數 */
const accompanyingNumber = ref([
  { id: 0, label: '0' },
  { id: 1, label: '1' },
  { id: 2, label: '2' },
  { id: 3, label: '3' },
]);

/** @const {object} 樓層 */
const floor = ref([
  { id: 2, label: '2F' },
  { id: 3, label: '3F' },
  { id: 4, label: '4F' },
  { id: 5, label: '5F' },
  { id: 6, label: '6F' },
]);

/** @func vee-validate驗證規則 ( rules.js ) */
const formValidationSchema = computed(() => ({
  name: 'required',
  phoneNumber: 'required|mobile',
  code: codeRequired.value,
  serviceArea: 'required',
  serviceType: 'required',
  fromAddress: `required|checkBoardingArea:${boardingArea.value}`,
  toAddress: 'required',
  reserveDate: `required|getOnRule:${getOnRule.value}`,
  wheelchairType: 'required',
  accompanyingNumber: 'required',
  remark: '',
  floor: floorRequired.value,
  startTime: homeServeRequired.value,
  endTime: homeServeRequired.value,
  charterHours: `max_value:12|min_value:4|charterHoursRule:${charterHoursRuleValue.value}`,
  organize: 'required',
}));

// vee-validate (useForm方法)
const {
  handleSubmit, // 處理提交的函數，當用戶提交表當時可以使用這個函數來處理指令
  values: modelFormVal, // 使用者輸入的值
  setValues, // 利用這個函數來設定表單的初始值
} = useForm({
  validationSchema: formValidationSchema, // 表單驗證規則模式，可以利用這個欄位來定義每個欄位應該要滿足的驗證條件
});

/** @func 設定預設值 (綁定範例 : v-model= " modelFormVal.account " ) */
setValues({
  name: '',
  phoneNumber: '',
  code: '',
  serviceArea: '',
  serviceType: '',
  fromAddress: '',
  toAddress: '',
  reserveDate: '',
  wheelchairType: '',
  accompanyingNumber: '',
  remark: '',
  floor: '',
  startTime: '',
  endTime: '',
  charterHours: '',
  organize: '',
});

// 判斷服務類別編號調整是否要驗證
watch(() => modelFormVal.serviceType, () => {
  floorRequired.value = '';
  homeServeRequired.value = '';

  // 動態切換樓層驗證 required|numeric codeRequired
  if (modelFormVal.serviceType === 3 || modelFormVal.serviceType === 5) {
    floorRequired.value = 'required';
  }

  // 動態切換居服驗證
  if (modelFormVal.serviceType === 4 || modelFormVal.serviceType === 5) {
    homeServeRequired.value = 'required';
  }
});

// 動態切換驗證碼驗證( 如果使用者填寫訂單畫面登出也要可以就變更驗證規則 )
watch(() => userAccessToken.value, () => {
  if (!userAccessToken.value) {
    codeRequired.value = 'required|numeric';
  }
});

// 動態切換驗證碼驗證
if (!userAccessToken.value) {
  codeRequired.value = 'required|numeric';
} else {
  codeRequired.value = '';
}

// 上車地區賦值給boardingArea給vee-validate做後續判斷
watch(() => modelFormVal.serviceArea, () => {
  boardingArea.value = modelFormVal.serviceArea;
});

// 包車時數vee-validate驗證用參數( 判斷包車時間是否符合營業時間 6:00-22:00 )
watch(() => modelFormVal.reserveDate, () => {
  charterHoursRuleValue.value = dayjs(modelFormVal.reserveDate).format('HH');
});

// 發送GetLatLngDistance取得經緯度時間
async function gapTimeFn() {
  if (fromGeoDisable.value && toGeoDisable.value) {
    sendLatLng.value = {
      fromLat: fromGeocodList.fromLat,
      fromLng: fromGeocodList.fromLng,
      toLat: toGeocodList.toLat,
      toLng: toGeocodList.toLng,
    };

    const {
      error, success, data,
    } = await FETCH_AUTH_ORDER.GetLatLngDistance(sendLatLng.value);

    if (error) return;

    if (!success) {
      swal.fire({
        icon: 'error',
        text: '地址格式錯誤',
        showConfirmButton: false,
        timer: 1500,
      });
      fromGeoAddress.value = '';
      toGeoAddress.value = '';
      fromGeoDisable.value = false;
      toGeoDisable.value = false;
    }

    gapTime.value = data.duration / 60;
    gapTime.value = Math.floor(gapTime.value);
  }
}

// 計算服務間隔時間
watch(() => [gapTime.value, modelFormVal.reserveDate, modelFormVal.fromAddress, modelFormVal.toAddress], () => {
  if (gapTime.value > 0) {
    boardingDateProp.value = !boardingDateProp.value;
    const yourDate = dayjs(modelFormVal.reserveDate, { format: 'ddd MMM DD YYYY HH:mm:ss' });
    const newDate = yourDate.add(gapTime.value + 30, 'minute');
    homeStartHour.value = Number(dayjs(newDate).format('HH'));
    homeStartMinute.value = Number(dayjs(newDate).format('mm'));
    homeEndHour.value = homeStartHour.value;
    // 計算除以15的餘數
    const remainder = homeStartMinute.value % 15;

    // 如果有餘數，將數字增加到最接近的15的倍數
    if (remainder !== 0) {
      homeStartMinute.value += (15 - remainder);
      homeEndMinute.value = homeStartMinute.value;
    }

    if (homeStartMinute.value === 60) {
      homeStartMinute.value = 0;
      homeEndMinute.value = 15;
      homeStartHour.value += 1;
      homeEndHour.value += 1;
    }

    if (homeStartMinute.value === 45) {
      homeEndMinute.value = 0;
      homeEndHour.value += 1;
    }
  }
});

/** @func 地址輸入取得模糊查詢地址列表(上車) */
async function searchFromGeoList() {
  fromGeoList.value = await searchLocalList(autocomplete, modelFormVal.fromAddress);
}

/** @func 送出地址取得經緯度(上車) */
async function getFromLatLng(description) {
  fromGeoDisable.value = true;
  fromGeoList.value = [];
  fromGeoAddress.value = description;
  const results = await getGeocoder(geocoder, fromGeoAddress.value);
  fromGeocodList = {
    fromLat: results[0].geometry.location.lat(),
    fromLng: results[0].geometry.location.lng(),
  };
  await gapTimeFn();
}

/** @func 點擊子層清除按鈕觸發清除模糊查詢地址列表內容(上車) */
function clearFromGeocodFn() {
  fromGeoDisable.value = false;
  fromGeoList.value = [];
  if (fromGeocodList) fromGeocodList = false;
  sendLatLng.value = [];
}

/** @func 地址輸入取得模糊查詢地址列表(下車) */
async function searchToGeoList() {
  toGeoList.value = await searchLocalList(autocomplete, modelFormVal.toAddress);
}

/** @func 送出地址取得經緯度(下車) */
async function getToLatLng(description) {
  toGeoDisable.value = true;
  toGeoList.value = [];
  toGeoAddress.value = description;
  const results = await getGeocoder(geocoder, toGeoAddress.value);
  toGeocodList = {
    toLat: results[0].geometry.location.lat(),
    toLng: results[0].geometry.location.lng(),
  };
  await gapTimeFn();
}

/** @func 點擊子層清除按鈕觸發清除模糊查詢地址列表內容(下車) */
function clearToGeocodFn() {
  toGeoDisable.value = false;
  toGeoList.value = [];
  if (toGeocodList) {
    toGeocodList = false;
  }
  sendLatLng.value = [];
}

// 取得國定假日計算點對點費用
axios.get('/holiday.json')
  .then((res) => {
    Holiday.value = res.data;
    isHolidayDataLoaded.value = true;
  })
  .catch((error) => {
    console.log(error);
  });

/** @func 計算訂單總金費用 */
function calcService(LatLngDistanceData, values) {
  // 將原始日期字符串解析為Day.js日期對象
  const parsedDate = dayjs(values.reserveDate);

  // 格式化日期為 'YYYYMMDD' 格式
  const formattedDate = parsedDate.format('YYYYMMDD');
  // console.log(formattedDate);

  // 如果訂單日期是國定假日就回傳( 計算點對點費用 )
  const isHoliday = Holiday.value.find((item) => item.Date === formattedDate);

  // 計算點對點預計費用
  const durationSeconds = LatLngDistanceData.duration / 60;
  switch (true) {
    case durationSeconds < 15:
      totalAmt.value = 300;
      break;
    case durationSeconds < 30:
      totalAmt.value = 400;
      break;
    case durationSeconds < 45:
      totalAmt.value = 600;
      break;
    case durationSeconds < 60:
      totalAmt.value = 800;
      break;
    case durationSeconds > 60:
      {
        const extraTime = durationSeconds - 60;
        const extraFee = Math.ceil(extraTime / 30) * 400;
        totalAmt.value = 800 + extraFee;
      }
      break;
    default:
      break;
  }

  if (isHoliday !== undefined) {
    // 例假日 (六日)*1.3 、 else if ( 春節特殊連假 *1.5 )
    if (isHoliday.isHoliday === '是' && isHoliday.description === '') {
      totalAmt.value *= 1.3;
    } else if (isHoliday.isHoliday === '是' && isHoliday.description !== '') {
      totalAmt.value *= 1.5;
    }

    // if (isHoliday.consecutiveHolidays === '是') {
    //   console.log('連續假日');
    // }
  }

  // 計算夜間加成費用
  const hour = Number(dayjs(values.reserveDate).format('HH'));
  if (hour >= 23 || hour < 6) {
    totalAmt.value *= 1.3;
  }

  // 點對點金額總計
  transportationAmt.value = totalAmt.value;

  // 計算包車接送金額
  if (values.serviceType === 2) {
    totalAmt.value = 0;
    transportationAmt.value = 0;
    totalAmt.value = values.charterHours * 800;
    charterAmt.value = totalAmt.value;
  }

  // 計算居服服務金額
  if (values.serviceType === 4 || values.serviceType === 5) {
    totalAmt.value += totalHours.value * 350;
    serviceAmt.value = totalHours.value * 350;
  }

  // 計算爬梯機金額
  if (values.serviceType === 3 || values.serviceType === 5) {
    const rentRules = {
      2: {
        新北: 800,
        台北: 800,
        台中: 800,
        台東: 800,
      },
      3: {
        新北: 800,
        台北: 800,
        台中: 900,
        台東: 900,
      },
      4: {
        新北: 900,
        台北: 900,
        台中: 1000,
        台東: 1000,
      },
      5: {
        新北: 1000,
        台北: 1000,
        台中: 1100,
        台東: 1100,
      },
      6: {
        新北: 0,
        台北: 0,
        台中: 1200,
        台東: 1200,
      },
    };

    if (rentRules[values.floor] && rentRules[values.floor][values.serviceArea]) {
      totalAmt.value += rentRules[values.floor][values.serviceArea];
      floorAmt.value = rentRules[values.floor][values.serviceArea];
    }
    totalAmt.value += 0;
  }
}

// 監聽乘車時間是否為連續假日如果是
watch(() => modelFormVal.reserveDate, () => {
  Holiday.value.find((item) => {
    if (item.consecutiveHolidays === '是') {
      if (item.Date === dayjs(modelFormVal.reserveDate).format('YYYYMMDD')) {
        getOnRule.value = true;
        return true; // 返回 true 表示找到匹配项
      }
    }
    getOnRule.value = false;
    return false; // 没有找到匹配项，返回 false
  });
});

// 設定居服結束必須大於起始時間
watch(() => modelFormVal.startTime, () => {
  if (modelFormVal.serviceType === 4 || modelFormVal.serviceType === 5) {
    if (modelFormVal.startTime !== null && modelFormVal.endTime !== null) {
      homeEndHour.value = Number(modelFormVal.startTime.slice(0, 2));
      homeEndMinute.value = Number(modelFormVal.startTime.slice(3, 5)) + 15;
      if (homeEndMinute.value === 60) {
        homeEndMinute.value = 0;
        homeEndHour.value += 1;
      }
      startTimeProp.value = !startTimeProp.value;
    }
  }
});

// 居服( 開始時間、結束時間 )計算時間區間時數
watch(() => [modelFormVal.startTime, modelFormVal.endTime], () => {
  if (modelFormVal.serviceType === 4 || modelFormVal.serviceType === 5) {
    if (modelFormVal.startTime !== null && modelFormVal.endTime !== null) {
      const startTimeHours = modelFormVal.startTime.slice(0, 2);
      const endTimeHours = modelFormVal.endTime.slice(0, 2);
      const startTimeMinutes = modelFormVal.startTime.slice(3, 5);
      const endTimeMinutes = modelFormVal.endTime.slice(3, 5);

      // 計算時間差(小時)
      const durationHours = endTimeHours - startTimeHours;
      // 計算時間差(分鐘)
      const durationMinutes = (endTimeMinutes - startTimeMinutes) % 60;

      // 如果有分钟，向上取整到最接近的小时数
      totalHours.value = durationHours + Math.ceil(durationMinutes / 60);
    }
  }
});

/** @func 導向預約訂單頁面 */
const onSubmit = handleSubmit(async (values) => {
  if (fromGeocodList && toGeocodList) {
    sendLatLng.value = {
      fromLat: fromGeocodList.fromLat,
      fromLng: fromGeocodList.fromLng,
      toLat: toGeocodList.toLat,
      toLng: toGeocodList.toLng,
    };
  }

  /** @func 參數:經緯度、取得點對點距離跟時間 */
  const {
    error: LatLngDistanceError, success: LatLngDistanceSuccess, data: LatLngDistanceData,
  } = await FETCH_AUTH_ORDER.GetLatLngDistance(sendLatLng.value);

  if (LatLngDistanceError) return;
  if (!LatLngDistanceSuccess) {
    swal.fire({
      icon: 'error',
      text: '地址格式錯誤',
      showConfirmButton: false,
      timer: 1500,
    });
  }

  const sendVerificationCodeCheck = {
    phoneNumber: values.phoneNumber,
    code: values.code,
  };

  /** @func 確認手機驗證碼是否正確 */
  if (!userAccessToken.value) {
    const {
      error: phoneCodeError, success: phoneCodeSuccess, message: phoneCodeMessage,
    } = await FETCH_AUTH_ORDER.VerificationCodeCheck(sendVerificationCodeCheck);

    if (phoneCodeError) return;
    if (phoneCodeSuccess) {
      console.log('驗證成功');
    } else {
      swal.fire({
        icon: 'error',
        text: phoneCodeMessage,
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }
  }

  if (LatLngDistanceSuccess) {
    // 計算訂單總金費用
    await calcService(LatLngDistanceData, values);

    /** @const  */
    organizeName.value = organizeList.value.find((item) => item.id === values.organize);

    /** @const {array} 預約訂單列表 */
    orderList.value = values;
    orderList.value.fromLat = LatLngDistanceData.fromLat;
    orderList.value.fromLng = LatLngDistanceData.fromLng;
    orderList.value.toLat = LatLngDistanceData.toLat;
    orderList.value.toLng = LatLngDistanceData.toLng;
    orderList.value.totalAmt = totalAmt.value;
    orderList.value.organizeId = modelFormVal.organize;
    orderList.value.transportationAmt = transportationAmt.value;
    orderList.value.charterAmt = charterAmt.value;
    orderList.value.floorAmt = floorAmt.value;
    orderList.value.serviceAmt = serviceAmt.value;

    const moveHour = Math.floor(LatLngDistanceData.duration / 60 / 60);
    const moveMinute = Math.floor(LatLngDistanceData.duration / 60) % 60;
    if (moveHour === 0) {
      movingTime.value = `${moveMinute} 分鐘 `;
    } else {
      movingTime.value = `${moveHour} 小時 ${moveMinute} 分鐘`;
    }

    // 依照服務類別刪減多餘的屬性
    switch (values.serviceType) {
      case 1:
        delete orderList.value.floor;
        delete orderList.value.startTime;
        delete orderList.value.endTime;
        delete orderList.value.charterHours;
        break;
      case 2:
        delete orderList.value.floor;
        delete orderList.value.startTime;
        delete orderList.value.endTime;
        break;
      case 3:
        delete orderList.value.startTime;
        delete orderList.value.endTime;
        delete orderList.value.charterHours;
        break;
      case 4:
        delete orderList.value.floor;
        delete orderList.value.charterHours;
        break;
      case 5:
        delete orderList.value.charterHours;
        break;
      default:
        break;
    }

    // 將服務類別代號轉名稱
    switch (orderList.value.serviceType) {
      case 1:
        serviceTypeName.value = '交通接送';
        break;
      case 2:
        serviceTypeName.value = '包車接送';
        break;
      case 3:
        serviceTypeName.value = '交通與爬梯機';
        break;
      case 4:
        serviceTypeName.value = '交通與居服服務';
        break;
      case 5:
        serviceTypeName.value = '交通與爬梯機與居服';
        break;
      default:
        break;
    }

    /** @boolean 控制頁面顯示/隱藏切換 */
    orderPage.value = false;
  }
});

/** @func 新增訂單 */
const creatOrder = async () => {
// 判斷是否有登入並取得使用userid，如果沒登入是訪客就取得臨時訪客id
  if (userAccessToken.value) {
    orderList.value.userId = UserInfo.value.id;
  } else {
    /** @func 訪客:取得一次性授權碼 */
    const { data: authCode, error } = await FETCH_AUTH_ORDER.GetAuthCode();
    if (error) return;

    const { data: loginData, success } = await FETCH_AUTH_ORDER.LoginByAuthCode({ authCode }, authCode);
    if (success) {
      userToken.value = loginData.accessToken;
      orderList.value.userId = loginData.id;

      if (!userAccessToken.value) {
        SET_COOKIES(userToken.value);
      }
    }
  }

  try {
    const { data: createData, success } = await FETCH_AUTH_ORDER.Create(orderList.value);

    if (success) {
      await swal.fire({
        icon: 'success',
        text: '預約成功',
        timer: 3000,
        timerProgressBar: true,
      });
      router.push(`/Order/${createData.orderNo}`);
    } else {
      throw new Error('Create API 失敗'); // 引發一個錯誤
    }
  } catch (error) {
    await swal.fire({
      icon: 'error',
      text: '新增訂單失敗請重新建立訂單',
      showConfirmButton: false,
      timer: 3000,
    });
    window.location.reload();
  } finally {
    if (!userAccessToken.value) {
      REMOVE_COOKIES();
    }
  }
};

/** @func 發送簡訊驗證碼 */
async function sendCodeToPhone() {
  if (!modelFormVal.phoneNumber) {
    swal.fire({
      icon: 'warning',
      iconColor: '#1E3E8F',
      text: '請先填寫手機號碼',
      confirmButtonText: '確定',
      confirmButtonColor: '#1E3E8F',
    });
    return;
  }

  // 驗證規則數字09開頭且09之後之後8位數字必須是0-9之間的數字
  if (!/^09[0-9]{8}$/.test(modelFormVal.phoneNumber)) {
    swal.fire({
      icon: 'warning',
      iconColor: '#1E3E8F',
      text: '手機號碼格式錯誤，請填寫正確的手機號碼。',
      confirmButtonText: '確定',
      confirmButtonColor: '#1E3E8F',
    });
    return;
  }

  /** @const Object 將符合格式的電話號碼放進物件 */
  const queryForm = {
    phoneNumber: modelFormVal.phoneNumber,
  };

  /** @const FormDate 將物件轉換為FormDate */
  const queryFormToFormData = qs.stringify(queryForm);

  /** @func API發送這邊規定要用(FormDate)格式發送 */
  const { error } = await FETCH_AUTH.VerificationCodeSend(queryFormToFormData);

  if (error) return;

  swal.fire({
    icon: 'success',
    iconColor: '#1E3E8F',
    text: '已發送簡訊至您填寫的手機號碼。',
    confirmButtonText: '確定',
    confirmButtonColor: '#1E3E8F',
  });
}

onMounted(async () => {
  const { data, error } = await FETCH_AUTH_ORDER.GetTreeList();
  if (error) return;
  organizeList.value = data;
});

</script>

<template>
  <UserTitle :title=" orderPage ? '接駁服務' : '預約訂單' " titleSrc='/images/orderTitle.svg'></UserTitle>
  <form v-show="orderPage" @submit.prevent="onSubmit()" class=" w-full max-w-990px  ">
    <!-- 接駁服務 -->
    <div class=" w-full  flex justify-center flex-col md:flex-row gap-80px ">
      <div class=" md:w-45% flex flex-col ">
        <Select v-model.number="modelFormVal.serviceArea" name="serviceArea" :items="serviceArea" itemLabel="label" label="上車地區" placeholder="請選擇上車地區"></Select>
        <Select v-model.number="modelFormVal.serviceType" name="serviceType" :value="modelFormVal.serviceArea" :items=" modelFormVal.serviceArea === '高雄' ? serviceType : serviceTypeAll" itemLabel="label" label="服務類別" placeholder="請選擇服務類別"  ></Select>
        <Select v-model.number="modelFormVal.organize" name="organize" :value="modelFormVal.organize" :items="organizeList" itemKey="id" itemLabel="name" label="選擇組織" placeholder="請選擇服務組織"  ></Select>
        <TextInput v-if="modelFormVal.serviceType === 2" v-model="modelFormVal.charterHours" name="charterHours" label="包車時數" type="number" :minRef="4" :isClose="false" placeholder="例:08:00 每小時為1個單位" />
        <TextInput v-model="fromGeoAddress" @closeBtnGeo="clearFromGeocodFn" @searchFromGeo="searchFromGeoList" :disabled="fromGeoDisable" name="fromAddress" label="上車地點" type="text" placeholder="請輸入上車地點">
          <template #serachLocal>
            <!-- 地圖設定地點、目前位置、上下車實際地點 -->
            <section v-if="fromGeoList.length > 0" class="absolute z-10 top-80px grid gap-8px p-10px bg-#fff border-2px border-solid rounded-10px cursor-pointer ">
              <p class=" text-center text-#666666 ">搜尋結果 - 請選擇地點</p>
              <div v-for=" (item, index) in fromGeoList " :key="index">
                <div @click=" getFromLatLng(item.description) " class=" hover:text-#097494 ">{{ item.description }}</div>
              </div>
            </section>
          </template>
        </TextInput>
        <TextInput v-model="toGeoAddress" @closeBtnGeo="clearToGeocodFn" @searchFromGeo="searchToGeoList" :disabled="toGeoDisable" name="toAddress" label="下車地點" type="text" placeholder="請輸入下車地點">
          <template #serachLocal>
            <!-- 地圖設定地點、目前位置、上下車實際地點 -->
            <section v-if="toGeoList.length > 0" class="absolute z-10 top-80px grid gap-8px p-10px bg-#fff border-2px border-solid rounded-10px cursor-pointer ">
              <p class=" text-center text-#666666 ">搜尋結果 - 請選擇地點</p>
              <div v-for=" (item, index) in toGeoList " :key="index">
                <div @click=" getToLatLng(item.description) " class=" hover:text-#097494 ">{{ item.description }}</div>
              </div>
            </section>
          </template>
        </TextInput>
        <DateSelector v-if=" isHolidayDataLoaded && modelFormVal.serviceType !== 2 " v-model="modelFormVal.reserveDate" label="乘車時間" name="reserveDate" placeholder="請選擇訂單日期"></DateSelector>
        <DateSelector v-if=" modelFormVal.serviceType === 2 "  v-model="modelFormVal.reserveDate" label="乘車時間" name="reserveDate" :mintime='6' :maxtime="18" placeholder="請選擇訂單日期"></DateSelector>
      </div>
      <div class=" md:w-45% flex flex-col " >
        <h3 class=" text-#297494 font-700 mb-30px ">服務對象資料</h3>
        <TextInput v-model="modelFormVal.name" :value="userAccessToken ? UserInfo.name : ''" name="name" label="訂車人姓名" type="text" placeholder="請輸入姓名" />
        <Select v-model.number="modelFormVal.wheelchairType" name="wheelchairType" :items="wheelchairType" itemLabel="label" label="輪椅種類" placeholder="請選擇輪椅種類"></Select>
        <Select v-model.number="modelFormVal.accompanyingNumber" name="accompanyingNumber" :items="accompanyingNumber" itemLabel="label" label="陪同人數" placeholder="請選擇人數"></Select>
        <TextInput v-model="modelFormVal.phoneNumber" name="phoneNumber" label="手機號碼" type="tel" :disabled="!userAccessToken ? false : true" :value="userAccessToken ? UserInfo.phoneNumber : ''" :isClose="false" placeholder="請輸入聯絡電話" :inputClass="!userAccessToken ? 'w-70%' : 'w-full'" class="!userAccessToken ? 'relative mb-30px' : 'relative mb-10px'">
          <template #button>
            <div v-if="!userAccessToken" @click.prevent="sendCodeToPhone()" title="驗證手機號碼" class=" absolute top-35px right-0 ml-auto w-115px text-center leading-36px bg-main_orange text-#fff cursor-pointer ">驗證手機號碼</div>
          </template>
        </TextInput>
        <TextInput v-if="!userAccessToken" v-model="modelFormVal.code" name="code" label="驗證碼" type="tel" :isClose="false" placeholder="請輸入驗證碼" :showLabel="false" />
        <TextAreas v-model="modelFormVal.remark" name="remark" label="乘客備註"  type="text" class=" mb-60px "></TextAreas>
        <h3 v-if="modelFormVal.serviceType === 3 || modelFormVal.serviceType === 5 " class=" text-#297494 font-700 mb-30px ">爬梯機</h3>
        <Select v-if="modelFormVal.serviceType === 3 || modelFormVal.serviceType === 5 " v-model.number="modelFormVal.floor" rules="required" name="floor" :items="floor" itemLabel="label" label="樓層" placeholder="請輸入樓層" class="mb-60px"></Select>
        <h3 v-if="modelFormVal.serviceType === 4 || modelFormVal.serviceType === 5 " class=" text-#297494 font-700 mb-30px ">居服服務</h3>
        <TimeSelector v-if="modelFormVal.serviceType === 4 || modelFormVal.serviceType === 5 " v-model="modelFormVal.startTime" :boardingDateChenge="boardingDateProp" :minHourTime="homeStartHour" :minMinuteTime="homeStartMinute" label="起始時間" name="startTime" placeholder="例:08:00 每15分鐘為1個單位" class="mb-30px" />
        <TimeSelector v-if="modelFormVal.serviceType === 4 || modelFormVal.serviceType === 5 " v-model="modelFormVal.endTime" label="結束時間" name="endTime" :startTimeChenge="startTimeProp" :minHourTime="homeEndHour" :minMinuteTime="homeEndMinute" placeholder="例:08:00 每15分鐘為1個單位" class="mb-30px" />
      </div>
    </div>
    <Button title="下一步" move="right" class=" w-40% m-[0_auto] mt-20px ">
      <template #title>
        <h5>下一步</h5>
      </template>
    </Button>
  </form>

  <!-- 預約訂單 -->
  <div v-if="!orderPage" class="w-full max-w-440px flex flex-col gap-20px">
    <div class=" flex gap-20px ">
      <h5 class=" min-w-90px text-#9E9E9E ">上車地區</h5>
      <h5>{{ orderList.serviceArea }}</h5>
    </div>
    <div class=" flex gap-20px ">
      <h5 class=" min-w-90px text-#9E9E9E ">服務類別</h5>
      <h5>{{ serviceTypeName }}</h5>
    </div>
    <div class=" flex gap-20px ">
      <h5 class=" min-w-90px text-#9E9E9E ">服務組織</h5>
      <h5>{{ organizeName.name }}</h5>
    </div>
    <div v-if="modelFormVal.serviceType === 2" class=" flex gap-20px ">
      <h5 class=" min-w-90px text-#9E9E9E ">包車時數</h5>
      <h5>{{ orderList.charterHours }}</h5>
    </div>
    <div class=" flex gap-20px ">
      <h5 class=" min-w-90px text-#9E9E9E ">上車地點</h5>
      <h5>{{ orderList.fromAddress }}</h5>
    </div>
    <div class=" flex gap-20px ">
      <h5 class=" min-w-90px text-#9E9E9E ">下車地點</h5>
      <h5>{{ orderList.toAddress }}</h5>
    </div>
    <div class=" flex gap-20px ">
      <h5 class=" min-w-90px text-#9E9E9E ">乘車時間</h5>
      <h5>{{ dayjs(orderList.reserveDate).format('YYYY/MM/DD HH:mm') }}</h5>
    </div>
    <div class=" border-b border-solid border-#D9D9D9 "></div>
    <h3 class=" text-#297494 font-700 ">服務對象資料</h3>
    <div class=" flex gap-20px ">
      <h5 class=" min-w-90px text-#9E9E9E ">訂車人姓名</h5>
      <h5>{{ orderList.name }}</h5>
    </div>
    <div class=" flex gap-20px ">
      <h5 class=" min-w-90px text-#9E9E9E ">輪椅種類</h5>
      <h5>{{ orderList.wheelchairType }}</h5>
    </div>
    <div class=" flex gap-20px ">
      <h5 class=" min-w-90px text-#9E9E9E ">陪同人數</h5>
      <h5>{{ orderList.accompanyingNumber }}人</h5>
    </div>
    <div class=" flex gap-20px ">
      <h5 class=" min-w-90px text-#9E9E9E ">手機號碼</h5>
      <h5>{{ orderList.phoneNumber }}</h5>
    </div>
    <div class=" flex gap-20px ">
      <h5 class=" min-w-90px text-#9E9E9E ">乘客備註</h5>
      <h5>{{ orderList.remark }}</h5>
    </div>
    <h3 v-if="modelFormVal.serviceType === 3 || modelFormVal.serviceType === 5 " class=" min-w-90px text-#297494 font-700 ">爬梯機</h3>
    <div v-if="modelFormVal.serviceType === 3 || modelFormVal.serviceType === 5 " class=" flex gap-20px ">
      <h5 class=" min-w-90px text-#9E9E9E ">樓層</h5>
      <h5>{{ orderList.floor }}樓</h5>
    </div>
    <h3 v-if="modelFormVal.serviceType === 4 || modelFormVal.serviceType === 5 " class=" text-#297494 font-700 ">居家服務</h3>
    <div v-if="modelFormVal.serviceType === 4 || modelFormVal.serviceType === 5 " class=" flex gap-20px ">
      <h5 class=" min-w-90px text-#9E9E9E ">起始時間</h5>
      <h5>{{ orderList.startTime }}</h5>
    </div>
    <div v-if="modelFormVal.serviceType === 4 || modelFormVal.serviceType === 5 " class=" flex gap-20px ">
      <h5 class=" min-w-90px text-#9E9E9E ">結束時間</h5>
      <h5>{{ orderList.endTime }}</h5>
    </div>
    <div class=" border-b border-solid border-#D9D9D9 "></div>
    <div class=" leading-39px flex flex-col items-end md:justify-end md:flex-row gap-20px ">
      <div class=" flex gap-6px ">
        <h5 class=" text-#9E9E9E ">預估移動時間 : </h5>
        <p class=" text-18px text-#CF3A3A font-bold ">{{ movingTime }}</p>
      </div>
      <div class=" flex gap-6px ">
        <h5 class=" text-#9E9E9E ">預計費用 : </h5>
        <p class=" text-32px text-#CF3A3A font-bold ">{{ orderList.totalAmt }}</p>
      </div>
    </div>
    <!-- <p class=" text-right ">費用計算為租用車輛X天數</p> -->
    <div class=" w-full flex justify-center gap-15px mt-50px md:w-90% ">
      <button @click="orderPage = !orderPage" class=" w-40% group flex justify-center items-center gap-10px bg-transparent border border-solid border-main_orange text-main_orange rounded-100px ">
        <img src="/public/images/arrowOrange.svg" alt="" class=" duration-300 group-hover:translate-x--10px group-hover:duration-300 ">
        <h5>返回</h5>
      </button>
      <button @click="creatOrder" class=" group w-40%  flex justify-center items-center gap-10px group flex justify-center items-center gap-10px bg-main_orange text-#fff rounded-100px h-40px ">
        <h5>確定</h5>
        <img src="/public/images/arrowWhite.svg" alt="" class=" duration-300 group-hover:translate-x-10px group-hover:duration-300 ">
      </button>
    </div>
  </div>

</template>
