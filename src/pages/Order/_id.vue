<script setup>
import { onMounted, ref, inject } from 'vue';
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import qs from 'qs';
import { FETCH_AUTH_ORDER } from '@/service';
import { setupUserAuthStore } from '@/stores/userAurhStore';
import Button from '@/components/common/Button.vue';
import UserTitle from '@/components/UserTitle.vue';
// 123
const swal = inject('$swal');

const route = useRoute();

/** @const {object} Pinia方法存放使用者資訊 */
const userStore = setupUserAuthStore();

/** @const {object} Pinaia使用者資訊響應處理 */
const { AllUserInfo } = storeToRefs(userStore);

/** @const {object} 使用者資訊 */
const UserInfo = AllUserInfo;

/** @const {object} 時間方法處理 */
const dayjs = inject('$dayjs');

/** @const {array} 存放訂單資料 */
const orderList = ref([]);

/** @const {string} 代號轉換過後的服務類別名稱 */
const serviceTypeName = ref('');

/** @const {string} 預估移動時間 */
const movingTime = ref('');

/** @const {array} 服務類別列表 */
const serviceTypeNameList = {
  1: '交通接送',
  2: '包車接送',
  3: '交通與爬梯機',
  4: '交通與居服服務',
  5: '交通與爬梯機與居服',
};

/** @const {array} 訂單狀態列表 */
const titleList = {
  1: '新訂單',
  2: '已排班',
  3: '執行中',
  4: '已完成',
  5: '已取消',
};

/** @func 依動態id取得訂單資料 */
async function getOrderData() {
  const {
    error, success, data,
  } = await FETCH_AUTH_ORDER.GetByNo({ orderNo: route.params.id }, route.params.id);

  if (error) return;

  if (success) {
    orderList.value = data;
    // 將服務類別代號轉名稱
    serviceTypeName.value = serviceTypeNameList[orderList.value.serviceType] || '';
  }
}

/** @func 刪除訂單分為訪客及會員兩種身分 */
async function changeOrderCancel() {
  swal.fire({
    icon: 'warning',
    iconColor: '#F19700',
    html: `<p>確定要取消 <span class="text-DarkBlue fw-700">${dayjs(orderList.value.reserveDate).format('YYYY/MM/DD')}</span> 的訂單嗎？</p>`,
    confirmButtonText: '刪除',
    confirmButtonColor: '#FD2626',
    showCancelButton: true,
    cancelButtonText: '取消',
  }).then(async (result) => {
    if (result.isConfirmed) {
      if (!UserInfo.value.id) {
        swal.fire({
          text: '請輸入手機號碼',
          input: 'tel',
          confirmButtonText: '發送簡訊驗證碼',
          confirmButtonColor: '#FD2626',
          showCancelButton: true,
          cancelButtonText: '取消',
          preConfirm: async (text) => {
            if (!text) {
              swal.showValidationMessage('必填欄位');
              swal.hideLoading();
            } else if (!text.match(/^09\d{8}$/)) {
              swal.showValidationMessage('手機號碼格式錯誤');
              swal.hideLoading();
            } else {
              const queryForm = {
                phoneNumber: text,
              };
              const queryFormToFormData = qs.stringify(queryForm);
              const { error } = await FETCH_AUTH_ORDER.VerificationCodeSend(queryFormToFormData);

              if (error) return;

              swal.fire({
                text: '請輸入驗證碼',
                input: 'number',
                confirmButtonText: '刪除',
                confirmButtonColor: '#FD2626',
                showCancelButton: true,
                cancelButtonText: '取消',
                preConfirm: async (code) => {
                  if (!code) {
                    swal.showValidationMessage('必填欄位');
                    swal.hideLoading();
                  } else if (!code.match(/^[0-9]{4}$/)) {
                    swal.showValidationMessage('驗證碼格式錯誤');
                    swal.hideLoading();
                  } else {
                    const cancelQueryForm = {
                      phoneNumber: text,
                      code,
                      orderNo: route.params.id,
                    };
                    const { error: cancelError } = await FETCH_AUTH_ORDER.CancelSbirOrder(cancelQueryForm);

                    if (cancelError) return;

                    swal.fire({
                      icon: 'success',
                      iconColor: '#1E3E8F',
                      text: '取消訂單成功',
                      showConfirmButton: false,
                      timer: 3000,
                    }).then(async () => {
                      await getOrderData();
                    });
                  }
                },
              });
            }
          },
        });
      } else {
        const queryForm = {
          orderId: orderList.value.id,
          status: 5,
          cancelRemark: '',
        };
        const { error, success } = await FETCH_AUTH_ORDER.ChangeOrderStatus(queryForm);

        if (error) return;
        if (success) {
          swal.fire({
            icon: 'success',
            iconColor: '#1E3E8F',
            text: '取消訂單成功',
            showConfirmButton: false,
            timer: 1500,
          }).then(async () => {
            await getOrderData();
          });
        } else {
          swal.fire({
            icon: 'warning',
            iconColor: '#1E3E8F',
            text: '取消訂單失敗',
            showConfirmButton: false,
            timer: 1500,
          });
        }
      }
    }
  });
}

// 發送GetLatLngDistance取得經緯度時間
async function gapTimeFn() {
  const sendLatLng = {
    fromLat: orderList.value.fromLat,
    fromLng: orderList.value.fromLng,
    toLat: orderList.value.toLat,
    toLng: orderList.value.toLng,
  };

  const {
    error, success, data,
  } = await FETCH_AUTH_ORDER.GetLatLngDistance(sendLatLng);

  if (error) return;

  if (!success) {
    swal.fire({
      icon: 'error',
      text: '地址格式錯誤',
      showConfirmButton: false,
      timer: 1500,
    });
  }

  const moveHour = Math.floor(data.duration / 60 / 60);
  const moveMinute = Math.floor(data.duration / 60) % 60;
  if (moveHour === 0) {
    movingTime.value = `${moveMinute} 分鐘 `;
  } else {
    movingTime.value = `${moveHour} 小時 ${moveMinute} 分鐘`;
  }
}

/** @func 訂單狀態代碼傳換中文顯示 */
function checkStatus(status) {
  let title = '';
  title = titleList[status];
  return title;
}

/** @func 訂單狀態文字顯示顏色樣式 */
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
  await getOrderData();
  await gapTimeFn();
});
</script>

<template>
  <UserTitle title="訂單詳情" titleSrc='/images/orderTitle.svg'></UserTitle>

   <!-- <p :class="statusColor(orderList.status)">{{ checkStatus(orderList.status) }}</p> -->
   <!-- 預約訂單 -->
  <div class="w-full max-w-440px flex flex-col gap-20px">
    <div class=" flex gap-20px ">
      <h5 class=" min-w-90px text-#9E9E9E ">訂單編號</h5>
      <h5>{{ orderList.orderNo }}</h5>
    </div>

    <div class=" flex gap-20px ">
      <h5 class=" min-w-90px text-#9E9E9E ">訂單狀態</h5>
      <div class=" w-68px leading-16px text-center p-[10px_5px] text-16px rounded-[5px] "
      :class="statusColor(orderList.status)"
      >
        {{checkStatus(orderList.status)}}
      </div>
    </div>

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
      <h5>{{ orderList.organizeName }}</h5>
    </div>
    <div v-if="orderList.serviceType === 2" class=" flex gap-20px ">
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
      <h5>{{ dayjs(orderList.reserveDate ).format('YYYY/MM/DD HH:mm')}}</h5>
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
    <h3 v-if="orderList.serviceType === 3 || orderList.serviceType === 5 " class=" min-w-90px text-#297494 font-700 ">爬梯機</h3>
    <div v-if="orderList.serviceType === 3 || orderList.serviceType === 5 " class=" flex gap-20px ">
      <h5 class=" min-w-90px text-#9E9E9E ">樓層</h5>
      <h5>{{ orderList.floor }}樓</h5>
    </div>
    <h3 v-if="orderList.serviceType === 4 || orderList.serviceType === 5 " class=" text-#297494 font-700 ">居家服務</h3>
    <div v-if="orderList.serviceType === 4 || orderList.serviceType === 5 " class=" flex gap-20px ">
      <h5 class=" min-w-90px text-#9E9E9E ">起始時間</h5>
      <h5>{{ orderList.startTime }}</h5>
    </div>
    <div v-if="orderList.serviceType === 4 || orderList.serviceType === 5 " class=" flex gap-20px ">
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
    <div class=" w-full flex justify-center gap-15px mt-50px md:w-90% ">
      <Button title="修改資料" move="left" routerProp="/Record" class=" w-40% !bg-transparent !border !border-solid !border-main_orange !text-main_orange !rounded-100px ">
        <template #title>
          <h5>返回</h5>
        </template>
      </Button>
      <button v-if=" orderList.status !== 5 " @click="changeOrderCancel" class=" group w-40%  flex justify-center items-center gap-10px group flex justify-center items-center gap-10px bg-#CF3A3A text-#fff rounded-100px h-40px ">
        <h5>取消預約</h5>
        <img src="/public/images/arrowWhite.svg" alt="" class=" duration-300 group-hover:translate-x-10px group-hover:duration-300 ">
      </button>
    </div>
  </div>
</template>
