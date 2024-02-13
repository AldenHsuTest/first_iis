<script setup>
import { storeToRefs } from 'pinia';
import { setupUserAuthStore } from '@/stores/userAurhStore';
import MemberRecord from '@/components/Record/MemberRecord.vue';
import VisitorsRecord from '@/components/Record/VisitorsRecord.vue';

/** @Object 自建的Pinia方法( 存放使用者資訊 ) */
const userStore = setupUserAuthStore();

/** @Obect Pinaia使用者資訊響應處理 */
const { AllUserInfo } = storeToRefs(userStore);

/** @Object 使用者資訊 */
const UserInfo = AllUserInfo;

</script>

<template>
  <MemberRecord v-if="UserInfo.id"></MemberRecord>
  <VisitorsRecord v-else></VisitorsRecord>
</template>
