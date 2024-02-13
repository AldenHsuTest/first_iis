<script setup>
import { onMounted, ref, inject } from 'vue';
// import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import { FETCH_AUTH_ORDER } from '@/service';
import { setupUserAuthStore } from '@/stores/userAurhStore';
import { useBackTop } from '@/composables/gsapAnime';
import UserTitle from '@/components/UserTitle.vue';
import Pagination from '@/components/Pagination.vue';

// const route = useRoute();
/** @const {object} 時間方法處理 */
const dayjs = inject('$dayjs');

/** @Object 自建的Pinia方法( 存放使用者資訊 ) */
const userStore = setupUserAuthStore();

/** @Obect Pinaia使用者資訊響應處理 */
const { AllUserInfo } = storeToRefs(userStore);

/** @Object 使用者資訊 */
const UserInfo = AllUserInfo;

/** @const 訂單狀態切換 */
const selectTab = ref(null);

/** @array 訂單列表 */
const orderList = ref([]);

/** @const 訂單列表總數 */
const itemCount = ref(0);

/** @Object 服務類別 */
const serviceType = ref([
  { id: 1, label: '交通接送' },
  { id: 2, label: '包車接送' },
  { id: 3, label: '交通與爬梯機' },
  { id: 4, label: '交通與居服服務' },
  { id: 5, label: '交通與爬梯機與居服' },
]);

// Pagination
const Form = ref({
  page: 1,
  limit: 10,
  userId: UserInfo.value.id,
  status: null,
});

const statusList = [
  { title: '全部訂單', status: null },
  { title: '新訂單', status: 1 },
  { title: '已排班', status: 2 },
  { title: '執行中', status: 3 },
  { title: '已完成', status: 4 },
  { title: '已取消', status: 5 },
];

/** @func 取得歷史訂單資料 */
async function getOrderData(status) {
  if (status) {
    Form.value.status = status;
  } else {
    Form.value.status = null;
  }
  const {
    error, success, data,
  } = await FETCH_AUTH_ORDER.GetHistoricalOrderList(Form.value);

  if (error) return;

  if (success) {
    orderList.value = data.data;
    itemCount.value = data.itemCount;
    const filteredItems = orderList.value.map((item) => {
      const matchStatus = statusList.find((item2) => item.status === item2.status);
      if (matchStatus) {
        return {
          ...item,
          statusName: matchStatus.title,
        };
      }
      return item; // 如果没有匹配的 status，则返回原始 item
    });

    orderList.value = filteredItems;
  }
}

/** @func 切換pagination變更顯示資料 */
function updateVal(val) {
  Form.value.page = val;
  getOrderData(Form.value.status);
  useBackTop();
}

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
      return 'bg-#4EC27C text-#fff ';
    case 2:
      return 'bg-#FFBF60 ';
    case 3:
      return 'bg-#65A5C7 text-#fff ';
    case 4:
      return 'bg-#D9D9D9 ';
    case 5:
      return 'bg-#CF3A3A text-#fff ';
    default:
      return '';
  }
}

onMounted(async () => {
  getOrderData();
});

</script>

<template>
  <UserTitle title="訂單查詢" titleSrc='/images/orderTitle.svg'></UserTitle>

  <ul class=" min-w-auto w-full flex  gap-14px p-y-5px text-main_orange overflow-x-auto md:justify-center " >
    <li v-for=" item in statusList" :key="item.status" class=" flex-none ">
      <button @click="getOrderData(item.status),selectTab = item.status" class="p-y-5px px-20px  fw-700 text-18px " :class=" selectTab !== item.status ? 'border-b-1px border-solid border-main_orange' : 'bg-main_orange text-#fff' ">{{ item.title }}</button>
    </li>
  </ul>

  <transition name="fade" mode="out-in">
    <div :key="Form.status" class="w-100% lg:w-80%">
      <p v-if="orderList.length === 0" class=" text-center text-#959595 ">目前無預約資料</p>
      <div  v-for=" orderItem in orderList " :key="orderItem.orderNo">
        <router-link :to="`/Order/${orderItem.orderNo}`" class=" relative w-full flex flex-col gap-20px mb-30px p-20px border border-solid border-#D9D9D9 rounded-10px shadow-[0px_4px_4px_rgba(0,0,0,0.25)] active:shadow-none active:translate-y-5px active:translate-x-3px ">

          <div class=" w-full flex flex-col gap-20px sm:flex-row md:gap-20px">
            <div class=" sm:w-50% flex gap-20px ">
              <h5 class=" min-w-90px text-#9E9E9E ">訂單編號</h5>
              <h5>{{ orderItem.orderNo }}</h5>
            </div>

            <div class=" sm:w-50% flex gap-20px ">
              <h5 class=" min-w-90px text-#9E9E9E ">訂單狀態</h5>
              <div class=" w-68px leading-16px text-center p-[10px_5px] text-16px rounded-[5px] "
              :class="statusColor(orderItem.status)"
              >
                {{orderItem.statusName}}
              </div>
            </div>
          </div>

          <div class=" w-full flex flex-col gap-20px sm:flex-row md:gap-20px">
            <div class=" sm:w-50% flex gap-20px ">
              <h5 class=" min-w-90px text-#9E9E9E ">服務類別</h5>
              <h5>{{ serviceTypeToName(orderItem.serviceType) }}</h5>
            </div>
            <div class=" sm:w-50% flex gap-20px ">
              <h5 class=" min-w-90px text-#9E9E9E ">上車地區</h5>
              <h5>{{ orderItem.serviceArea }}</h5>
            </div>
          </div>

          <div class=" flex gap-20px ">
            <h5 class=" min-w-90px text-#9E9E9E ">服務組織</h5>
            <h5>{{ orderItem.organizeName }}</h5>
          </div>

          <div v-if="orderItem.serviceType === 2" class=" w-full flex flex-col gap-20px sm:flex-row md:gap-20px">
            <div class=" sm:w-50% flex gap-20px ">
              <h5 class=" min-w-90px text-#9E9E9E ">乘車時間</h5>
              <h5>{{ dayjs(orderItem.reserveDate).format('YYYY/MM/DD HH:mm') }}</h5>
            </div>
            <div  class=" sm:w-50% flex gap-20px ">
              <h5 class=" min-w-90px text-#9E9E9E ">包車時數</h5>
              <h5>{{ orderItem.charterHours }}</h5>
            </div>
          </div>

          <div class=" w-full flex flex-col gap-20px sm:flex-row md:gap-20px">
            <div class=" sm:w-50% flex gap-20px ">
              <h5 class=" min-w-90px text-#9E9E9E ">上車地點</h5>
              <h5>{{ orderItem.fromAddress }}</h5>
            </div>
            <div class=" sm:w-50%  flex gap-20px ">
              <h5 class=" min-w-90px text-#9E9E9E ">下車地點</h5>
              <h5>{{ orderItem.toAddress }}</h5>
            </div>
          </div>

          <div v-if="orderItem.serviceType !== 2" class=" flex gap-20px ">
            <h5 class=" min-w-90px text-#9E9E9E ">乘車時間</h5>
            <h5>{{ dayjs(orderItem.reserveDate).format('YYYY/MM/DD HH:mm') }}</h5>
          </div>

          <div class=" border-b border-solid border-#D9D9D9 "></div>

          <h3 class=" text-#297494 font-700 ">服務對象資料</h3>

          <div class=" w-full flex flex-col gap-20px sm:flex-row md:gap-20px">
            <div class=" sm:w-50% flex gap-20px ">
              <h5 class=" min-w-90px text-#9E9E9E ">訂車人姓名</h5>
              <h5>{{ orderItem.name }}</h5>
            </div>
            <div class=" sm:w-50%  flex gap-20px ">
              <h5 class=" min-w-90px text-#9E9E9E ">輪椅種類</h5>
              <h5>{{ orderItem.wheelchairType }}</h5>
            </div>
          </div>

          <div class=" w-full flex flex-col gap-20px sm:flex-row md:gap-20px">
            <div class=" sm:w-50% flex gap-20px ">
              <h5 class=" min-w-90px text-#9E9E9E ">陪同人數</h5>
              <h5>{{ orderItem.accompanyingNumber }}人</h5>
            </div>
            <div class=" sm:w-50%  flex gap-20px ">
              <h5 class=" min-w-90px text-#9E9E9E ">手機號碼</h5>
              <h5>{{ orderItem.phoneNumber }}</h5>
            </div>
          </div>

          <h3 v-if="orderItem.serviceType === 3 || orderItem.serviceType === 5 " class=" min-w-90px text-#297494 font-700 ">爬梯機</h3>
          <div v-if="orderItem.serviceType !== 2" class=" flex gap-20px ">
            <h5 class=" min-w-90px text-#9E9E9E ">樓層</h5>
            <h5>{{ orderItem.floor }}樓</h5>
          </div>

          <h3 v-if="orderItem.serviceType === 4 || orderItem.serviceType === 5 " class=" text-#297494 font-700 ">居家服務</h3>
          <div v-if="orderItem.serviceType === 4 || orderItem.serviceType === 5 " class=" w-full flex flex-col gap-20px sm:flex-row md:gap-20px">
            <div class=" sm:w-50% flex gap-20px ">
              <h5 class=" min-w-90px text-#9E9E9E ">起始時間</h5>
              <h5>{{ orderItem.startTime }}</h5>
            </div>
            <div class=" sm:w-50%  flex gap-20px ">
              <h5 class=" min-w-90px text-#9E9E9E ">結束時間</h5>
              <h5>{{ orderItem.endTime }}</h5>
            </div>
          </div>

          <div class=" sm:w-50%  flex gap-20px ">
            <h5 class=" min-w-90px text-#9E9E9E ">乘客備註</h5>
            <h5>{{ orderItem.remark }}</h5>
          </div>
        </router-link>
      </div>
    </div>
  </transition>

  <!-- pagination -->
  <div class=" flex justify-center ">
    <Pagination @update:modelValue="updateVal" v-model="Form.page" :pageLimit="[Form.limit]" :totalData="itemCount" />
  </div>

</template>
