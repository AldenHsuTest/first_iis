<script setup>
import { inject } from 'vue';
import { storeToRefs } from 'pinia';
import { setupUserAuthStore } from '@/stores';
import UserTitle from '@/components/UserTitle.vue';
import Button from '@/components/common/Button.vue';
import TextInputInfo from '@/components/common/TextInputInfo.vue';

/** @Object 時間方法處理 */
const dayjs = inject('$dayjs');

/** @Object 自建的Pinia方法( 存放使用者資訊 ) */
const AuthInfo = setupUserAuthStore();

/** @Obect Pinaia使用者資訊響應處理 */
const { AllUserInfo } = storeToRefs(AuthInfo);

/** @Object 使用者資訊 */
const UserInfo = AllUserInfo;

/** @const 轉換生日格式 */
if (UserInfo.value.birthday) {
  UserInfo.value.birthday = dayjs(UserInfo.value.birthday).format('YYYY/MM/DD');
} else {
  UserInfo.value.birthday = '尚未填寫';
}

</script>

<template>
    <UserTitle title="會員資料"></UserTitle>

    <form class=" w-90% max-w-440px flex flex-col ">
      <TextInputInfo v-model="UserInfo.name" label="會員姓名" disabled ></TextInputInfo>
      <TextInputInfo v-model="UserInfo.account" label="會員帳號" disabled></TextInputInfo>
      <TextInputInfo v-model="UserInfo.phoneNumber" label="手機號碼" disabled></TextInputInfo>
      <TextInputInfo v-model="UserInfo.email" label="Email" disabled></TextInputInfo>
      <TextInputInfo v-model="UserInfo.gender" label="性別" disabled></TextInputInfo>
      <TextInputInfo v-model="UserInfo.idNumber" label="身分證字號" disabled></TextInputInfo>
      <TextInputInfo v-model="UserInfo.birthday" label="生日" disabled></TextInputInfo>
      <div class=" flex gap-15px ">
        <Button title="修改資料" move="right" routerProp="/Edit" class=" w-50% ">
          <template #title>
            <h5>修改資料</h5>
          </template>
        </Button>
        <Button title="重設密碼" move="rotate" routerProp="/ResetPwd" class=" w-50% !bg-#297494 ">
          <template #title>
            <h5>重設密碼</h5>
          </template>
        </Button>
      </div>
    </form>
</template>
