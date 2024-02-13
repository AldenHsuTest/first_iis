<script setup>
import { onMounted, ref, inject } from 'vue';
import { useForm } from 'vee-validate';
import { FETCH_AUTH_ORDER } from '@/service';
import UserTitle from '@/components/UserTitle.vue';
import TextInput from '@/components/common/TextInput.vue';
import Button from '@/components/common/Button.vue';

const Swal = inject('$swal');

/** @Object 時間方法處理 */
const dayjs = inject('$dayjs');

/** @array 訂單列表 */
const orderList = ref([]);

/** @Object 訂單狀態 */
const statusList = [
  { title: '全部訂單', status: null },
  { title: '新訂單', status: 1 },
  { title: '已排班', status: 2 },
  { title: '執行中', status: 3 },
  { title: '已完成', status: 4 },
  { title: '已取消', status: 5 },
];

/** @Object 服務類別 */
const serviceType = ref([
  { id: 1, label: '交通接送' },
  { id: 2, label: '包車接送' },
  { id: 3, label: '交通與爬梯機' },
  { id: 4, label: '交通與居服服務' },
  { id: 5, label: '交通與爬梯機與居服' },
]);

/** @func vee-validate驗證規則 ( rules.js ) */
const formValidationSchema = {
  orderNo: 'required',
};

// vee-validate (useForm方法)
const {
  handleSubmit, // 處理提交的函數，當用戶提交表當時可以使用這個函數來處理指令
  setValues, // 利用這個函數來設定表單的初始值
  values: modelFormVal, // 使用者輸入的值
} = useForm({
  validationSchema: formValidationSchema, // 表單驗證規則模式，可以利用這個欄位來定義每個欄位應該要滿足的驗證條件
});

/** @func 登入取得Token存進pinia跟cookie */
const onSubmit = handleSubmit(async (values) => {
  const {
    error, success, data, message,
  } = await FETCH_AUTH_ORDER.GetByNo({ orderNo: values.orderNo }, values.orderNo);

  if (error) return;

  if (success) {
    orderList.value = data;

    const matchStatus = statusList.find((item) => orderList.value.status === item.status);

    if (matchStatus) {
      orderList.value.statusName = matchStatus.title;
    }
  } else {
    Swal.fire({
      icon: 'error',
      text: message,
      timer: 3000,
      timerProgressBar: true,
      showConfirmButton: false,
    });
  }
});

/** @func 設定預設值 (綁定範例 : v-model= " modelFormVal.account " ) */
setValues({
  orderNo: '',
});

/** @func 服務代碼傳換服務名稱 */
function serviceTypeToName(serviceCode) {
  const foundService = serviceType.value.find((serviceName) => serviceName.id === serviceCode);
  if (foundService) {
    return foundService.label;
  }
  return null; // 或者根据需求返回适当的值
}

function statusColor(status) {
  switch (status) {
    case 1:
      return 'bg-#FFBF60 ';
    case 2:
      return 'bg-#FFBF60 ';
    case 3:
      return 'bg-#FFBF60 ';
    case 4:
      return 'bg-#FFBF60 ';
    case 5:
      return 'bg-#FFBF60 ';
    default:
      return '';
  }
}

onMounted(async () => {
  handleSubmit();
});

</script>

<template>
  <UserTitle title="訪客訂單查詢" titleSrc='/images/orderTitle.svg'></UserTitle>

  <form @submit.prevent="onSubmit()" class=" w-90% max-w-440px flex flex-col">
    <TextInput v-model="modelFormVal.orderNo" name="orderNo" label="訂單編號" type="text" placeholder="請輸入訂單編號" />

    <Button title="登入" move="right" >
      <template #title>
        <h5>查詢</h5>
      </template>
    </Button>

    <div class=" flex justify-end gap-10px mt-20px ">
      <h5 class=" text-#9E9E9E ">已有帳號?</h5>
      <router-link to="/Login" title="前往註冊頁面" class=" text-18px text-#297494 text-center ">
        立即登入
      </router-link>
    </div>
  </form>

  <transition name="fade" mode="out-in">
    <div v-if="orderList.status" :key="orderList.status" class="w-100% lg:w-80%">
      <router-link :to="`/Order/${orderList.orderNo}`" class=" relative w-full flex flex-col gap-20px mb-30px p-20px border border-solid border-#D9D9D9 rounded-10px shadow-[0px_4px_4px_rgba(0,0,0,0.25)] active:shadow-none active:translate-y-5px active:translate-x-3px ">

      <div class=" w-full flex flex-col gap-20px sm:flex-row md:gap-20px">
        <div class=" sm:w-50% flex gap-20px ">
          <h5 class=" min-w-90px text-#9E9E9E ">訂單編號</h5>
          <h5>{{ orderList.orderNo }}</h5>
        </div>

        <div class=" sm:w-50% flex gap-20px ">
          <h5 class=" min-w-90px text-#9E9E9E ">訂單狀態</h5>
          <div class=" w-68px leading-16px text-center p-[10px_5px] text-16px rounded-[5px] "
            :class="statusColor(orderList.status)"
            >
              {{orderList.statusName}}
          </div>
        </div>
      </div>

        <div class=" w-full flex flex-col gap-20px sm:flex-row md:gap-20px">
          <div class=" sm:w-50% flex gap-20px ">
            <h5 class=" min-w-90px text-#9E9E9E ">服務類別</h5>
            <h5>{{ serviceTypeToName(orderList.serviceType) }}</h5>
          </div>
          <div class=" sm:w-50% flex gap-20px ">
            <h5 class=" min-w-90px text-#9E9E9E ">上車地區</h5>
            <h5>{{ orderList.serviceArea }}</h5>
          </div>
        </div>

        <div class=" flex gap-20px ">
          <h5 class=" min-w-90px text-#9E9E9E ">服務組織</h5>
          <h5>{{ orderList.organizeName }}</h5>
        </div>

        <div v-if="orderList.serviceType === 2"  class=" w-full flex flex-col gap-20px sm:flex-row md:gap-20px">
          <div class=" sm:w-50% flex gap-20px ">
            <h5 class=" min-w-90px text-#9E9E9E ">乘車時間</h5>
            <h5>{{ dayjs(orderList.reserveDate).format('YYYY/MM/DD HH:mm') }}</h5>
          </div>
          <div class=" sm:w-50% flex gap-20px ">
            <h5 class=" min-w-90px text-#9E9E9E ">包車時數</h5>
            <h5>{{ orderList.charterHours }}</h5>
          </div>
        </div>

        <div class=" w-full flex flex-col gap-20px sm:flex-row md:gap-20px">
          <div class=" sm:w-50% flex gap-20px ">
            <h5 class=" min-w-90px text-#9E9E9E ">上車地點</h5>
            <h5>{{ orderList.fromAddress }}</h5>
          </div>
          <div class=" sm:w-50%  flex gap-20px ">
            <h5 class=" min-w-90px text-#9E9E9E ">下車地點</h5>
            <h5>{{ orderList.toAddress }}</h5>
          </div>
        </div>

        <div v-if="orderList.serviceType !== 2" class=" flex gap-20px ">
          <h5 class=" min-w-90px text-#9E9E9E ">乘車時間</h5>
          <h5>{{ dayjs(orderList.reserveDate).format('YYYY/MM/DD HH:mm') }}</h5>
        </div>

        <div class=" border-b border-solid border-#D9D9D9 "></div>

        <h3 class=" text-#297494 font-700 ">服務對象資料</h3>

        <div class=" w-full flex flex-col gap-20px sm:flex-row md:gap-20px">
          <div class=" sm:w-50% flex gap-20px ">
            <h5 class=" min-w-90px text-#9E9E9E ">訂車人姓名</h5>
            <h5>{{ orderList.name }}</h5>
          </div>
          <div class=" sm:w-50%  flex gap-20px ">
            <h5 class=" min-w-90px text-#9E9E9E ">輪椅種類</h5>
            <h5>{{ orderList.wheelchairType }}</h5>
          </div>
        </div>

        <div class=" w-full flex flex-col gap-20px sm:flex-row md:gap-20px">
          <div class=" sm:w-50% flex gap-20px ">
            <h5 class=" min-w-90px text-#9E9E9E ">陪同人數</h5>
            <h5>{{ orderList.accompanyingNumber }}人</h5>
          </div>
          <div class=" sm:w-50%  flex gap-20px ">
            <h5 class=" min-w-90px text-#9E9E9E ">手機號碼</h5>
            <h5>{{ orderList.phoneNumber }}</h5>
          </div>
        </div>

        <h3 v-if="orderList.serviceType === 3 || orderList.serviceType === 5 " class=" min-w-90px text-#297494 font-700 ">爬梯機</h3>
        <div v-if="orderList.serviceType !== 2" class=" flex gap-20px ">
          <h5 class=" min-w-90px text-#9E9E9E ">樓層</h5>
          <h5>{{ orderList.floor }}樓</h5>
        </div>

        <h3 v-if="orderList.serviceType === 4 || orderList.serviceType === 5 " class=" text-#297494 font-700 ">居家服務</h3>
        <div v-if="orderList.serviceType === 4 || orderList.serviceType === 5 " class=" w-full flex flex-col gap-20px sm:flex-row md:gap-20px">
          <div class=" sm:w-50% flex gap-20px ">
            <h5 class=" min-w-90px text-#9E9E9E ">起始時間</h5>
            <h5>{{ orderList.startTime }}</h5>
          </div>
          <div class=" sm:w-50%  flex gap-20px ">
            <h5 class=" min-w-90px text-#9E9E9E ">結束時間</h5>
            <h5>{{ orderList.endTime }}</h5>
          </div>
        </div>

        <div class=" sm:w-50%  flex gap-20px ">
          <h5 class=" min-w-90px text-#9E9E9E ">乘客備註</h5>
          <h5>{{ orderList.remark }}</h5>
        </div>

      </router-link>
    </div>
  </transition>

</template>
