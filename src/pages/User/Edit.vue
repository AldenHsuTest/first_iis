<script setup>
import {
  ref, inject, computed, onMounted,
} from 'vue';
import { useRouter } from 'vue-router';
import { useForm } from 'vee-validate';
import { storeToRefs } from 'pinia';
import { setupUserAuthStore } from '@/stores';
import { FETCH_AUTH } from '@/service';
import TextInput from '@/components/common/TextInput.vue';
import Button from '@/components/common/Button.vue';
import Select from '@/components/common/Select.vue';
import UserTitle from '@/components/UserTitle.vue';
import DateSelector from '@/components/common/DateSelector.vue';

const swal = inject('$swal');
const router = useRouter();

/** @Object 自建的Pinia方法( 存放使用者資訊 ) */
const AuthInfo = setupUserAuthStore();

/** @Obect Pinaia使用者資訊響應處理 */
const { AllUserInfo } = storeToRefs(AuthInfo);

const genderArr = ref([
  { id: '男', label: '男' },
  { id: '女', label: '女' },
]);

const formValidationSchema = computed(() => ({
  id: 'required',
  name: 'required',
  account: 'required',
  phoneNumber: 'required',
  email: 'email',
  gender: 'required|',
  idNumber: 'required|idNum',
  birthday: 'required',
}));

// 表單
const {
  // eslint-disable-next-line no-unused-vars
  handleSubmit, values: modelFormVal, setValues,
} = useForm({
  validationSchema: formValidationSchema,
});

/** @func 取得會員資料 */
function getUserInfo() {
  const {
    id, name, account, phoneNumber, email, gender, idNumber, birthday,
  } = AllUserInfo.value;
  setValues({
    id,
    name,
    account,
    phoneNumber,
    email,
    gender,
    idNumber,
    birthday,
  });
}

const onSubmit = handleSubmit(async (values) => {
  const { error, success, message } = await FETCH_AUTH.Update(values);

  if (error) return;

  if (success) {
    swal.fire({
      icon: 'success',
      iconColor: '#1E3E8F',
      text: '修改個人資料成功',
      showConfirmButton: false,
      timer: 1500,
    }).then(() => {
      router.push('/info');
    });
  } else {
    swal.fire({
      icon: 'error',
      text: message,
      showConfirmButton: false,
      timer: 1500,
    });
  }
});

onMounted(() => {
  getUserInfo();
});

</script>

<template>
  <UserTitle title="修改會員資料"></UserTitle>

  <form @submit.prevent="onSubmit()" class=" w-90% max-w-440px flex flex-col ">
    <TextInput name="name" label="會員姓名" placeholder="請輸入姓名"/>
    <TextInput name="account" label="會員帳號" :disabled="true" :isClose="false" />
    <TextInput name="phoneNumber" label="手機號碼" :disabled="true" :isClose="false"  />
    <TextInput name="email" label="Email" placeholder="請輸入Email" />
    <Select name="gender" :items="genderArr" itemLabel="label" label="性別"></Select>
    <TextInput name="idNumber" label="身分證字號" placeholder="請輸入身分證字號" />
    <DateSelector v-model="modelFormVal.birthday" label="生日" name="birthday" placeholder="請選擇生日"></DateSelector>
    <div class=" flex gap-15px mt-30px ">
      <Button title="返回" move="left" routerProp="/Info" class=" w-50% !bg-transparent !border !border-solid !border-main_orange !text-main_orange ">
        <template #title>
          <h5>返回</h5>
        </template>
      </Button>
      <Button title="儲存" move="right" class=" w-50% ">
        <template #title>
          <h5>儲存</h5>
        </template>
      </Button>
    </div>
  </form>
</template>

<style scoped>
:deep(.dp__icon) {
  top: 35%;
}
</style>
