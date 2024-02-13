<script setup>
import {
  ref, inject, computed,
} from 'vue';
import { useForm } from 'vee-validate';
import { useRouter } from 'vue-router';
import qs from 'qs';
import TextInput from '@/components/common/TextInput.vue';
import Button from '@/components/common/Button.vue';
import UserTitle from '@/components/UserTitle.vue';
import DateSelector from '@/components/common/DateSelector.vue';
import Select from '@/components/common/Select.vue';
import { FETCH_AUTH } from '../service';

const swal = inject('$swal');

const router = useRouter();

/** @Object 性別選單 */
const genderArr = ref([
  { id: '男', label: '男' },
  { id: '女', label: '女' },
]);

/** @const Object 切換密碼type使用 */
const passwordViewType = ref({
  password: 'password',
  confirmPassword: 'password',
});

/** @func vee-validate驗證規則 ( rules.js ) */
const formValidationSchema = computed(() => ({
  name: 'required',
  account: 'required|accountRule',
  password: 'required|pwdRule',
  confirmPassword: 'required|alpha_num|confirmed:password',
  phoneNumber: 'required|mobile',
  code: 'required|numeric',
  email: 'email',
  gender: 'required',
  idNumber: 'required|idNum',
  birthday: 'required',
}));

// vee-validate (useForm方法)
const {
  handleSubmit, // 處理提交的函數，當用戶提交表當時可以使用這個函數來處理指令
  setValues, // 利用這個函數來設定表單的初始值
  values: modelFormVal, // 使用者輸入的值
} = useForm({
  validationSchema: formValidationSchema, // 表單驗證規則模式，可以利用這個欄位來定義每個欄位應該要滿足的驗證條件
});

/** @func 設定預設值 (綁定範例 : v-model= " modelFormVal.account " ) */
setValues({
  name: '',
  account: '',
  password: '',
  confirmPassword: '',
  phoneNumber: '',
  code: '',
  email: '',
  gender: '',
  idNumber: '',
  birthday: '',
});

/** @func 註冊成功導向登入頁面 */
const onSubmit = handleSubmit(async (values) => {
  const { error, success, message } = await FETCH_AUTH.Register(values);

  if (error) return;

  if (success) {
    swal.fire({
      icon: 'success',
      iconColor: '#1E3E8F',
      text: '註冊會員成功',
      showConfirmButton: false,
      timer: 1500,
    }).then(() => {
      router.push('/Login');
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

</script>

<template>
    <UserTitle title="註冊"></UserTitle>

    <form @submit.prevent="onSubmit()" class=" w-90% max-w-440px flex flex-col ">
      <TextInput v-model="modelFormVal.name" name="name" label="姓名" type="text" placeholder="請輸入姓名" />
      <TextInput v-model="modelFormVal.account" name="account" label="帳號" type="text" placeholder="請輸入5-20碼英文加數字的帳號" />
      <TextInput v-model="modelFormVal.password" name="password" label="密碼" :isClose="false" :type="passwordViewType.password" placeholder="請輸入6-12碼英文加數字的密碼">
        <template #backIcon>
          <div @click.prevent="passwordViewType.password === 'password' ? passwordViewType.password = 'text' : passwordViewType.password = 'password'" class="absolute top-0 right-0 w-50px h-full flex items-center justify-center">
            <fa :icon="passwordViewType.password === 'password' ? 'far fa-eye-slash' : 'far fa-eye'" class="cursor-pointer select-none" />
          </div>
        </template>
      </TextInput>
      <TextInput v-model="modelFormVal.confirmPassword" name="confirmPassword" rules="confirmed:password" label="確認密碼" :isClose="false" :type="passwordViewType.confirmPassword" placeholder="請再次輸入密碼">
        <template #backIcon>
          <div @click.prevent="passwordViewType.confirmPassword === 'password' ? passwordViewType.confirmPassword = 'text' : passwordViewType.confirmPassword = 'password'" class="absolute top-0 right-0 w-50px h-full flex items-center justify-center">
            <fa :icon="passwordViewType.confirmPassword === 'password' ? 'far fa-eye-slash' : 'far fa-eye'" class="cursor-pointer select-none" />
          </div>
        </template>
      </TextInput>
      <TextInput v-model="modelFormVal.phoneNumber" name="phoneNumber" label="手機號碼" type="tel" :isClose="false" placeholder="請輸入聯絡電話" :inputClass="'w-70% '" :class="' relative mb-10px '"  >
        <template #button>
          <div @click.prevent="sendCodeToPhone()" title="驗證手機號碼" class=" absolute top-35px right-0 ml-auto w-115px text-center leading-36px bg-main_orange text-#fff cursor-pointer ">驗證手機號碼</div>
        </template>
      </TextInput>
      <TextInput v-model="modelFormVal.code" name="code" label="驗證碼" type="tel" :isClose="false" placeholder="請輸入驗證碼" :showLabel="false" />
      <TextInput v-model="modelFormVal.email" name="email" label="Email" placeholder="請輸入Email" />
      <Select v-model="modelFormVal.gender" name="gender" :items="genderArr" itemLabel="label" label="性別"></Select>
      <TextInput v-model="modelFormVal.idNumber" name="idNumber" label="身分證字號" placeholder="請輸入身分證字號" />
      <DateSelector v-model="modelFormVal.birthday" label="生日" name="birthday" placeholder="請選擇生日"></DateSelector>

      <Button title="註冊" move="right" >
        <template #title>
          <h5>註冊</h5>
        </template>
      </Button>

      <div class=" flex justify-end gap-10px mt-50px ">
        <h5 class=" text-#9E9E9E ">已有帳號?</h5>
        <router-link to="/Login" title="前往註冊頁面" class=" text-18px text-#297494 text-center ">
          立即登入
        </router-link>
      </div>
    </form>
</template>

<style scoped>
:deep(.dp__icon) {
  top: 50%;
}
</style>
