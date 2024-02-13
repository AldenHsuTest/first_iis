<script setup>
import { ref, inject, computed } from 'vue';
import { useForm } from 'vee-validate';
import { useRouter } from 'vue-router';
import qs from 'qs';
import TextInput from '@/components/common/TextInput.vue';
import UserTitle from '@/components/UserTitle.vue';
import { FETCH_AUTH } from '../service';

const swal = inject('$swal');
const router = useRouter();

/** @const Object 切換密碼type使用 */
const passwordViewType = ref({
  password: 'password',
  confirmPassword: 'password',
});

/** @func vee-validate驗證規則 ( rules.js ) */
const formValidationSchema = computed(() => ({
  password: 'required|pwdRule',
  confirmPassword: 'required|confirmed:password',
  phoneNumber: 'required|mobile',
  code: 'required|numeric',
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
  password: '',
  confirmPassword: '',
  phoneNumber: '',
  code: '',
});

/** @func 修改密碼成功導向登入頁面 */
const onSubmit = handleSubmit(async (values) => {
  const { error } = await FETCH_AUTH.ChangePassword(values);

  if (error) return;

  swal.fire({
    icon: 'success',
    iconColor: '#1E3E8F',
    text: '修改密碼成功',
    showConfirmButton: false,
    timer: 1500,
  }).then(() => {
    router.push('/login');
  });
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
  <UserTitle title="修改密碼"></UserTitle>
  <form @submit.prevent="onSubmit()" class=" w-90% max-w-440px flex flex-col ">
    <TextInput v-model="modelFormVal.phoneNumber" name="phoneNumber" label="手機號碼" type="tel" placeholder="請輸入聯絡電話" :inputClass="'w-70% '" :isClose="false" :class="' relative mb-10px '"  >
      <template #button>
        <div @click.prevent="sendCodeToPhone()" title="驗證手機號碼" class=" absolute top-35px right-0 ml-auto w-115px text-center leading-36px bg-main_orange text-#fff cursor-pointer ">驗證手機號碼</div>
      </template>
    </TextInput>
    <TextInput v-model="modelFormVal.code" name="code" label="驗證碼" type="tel" placeholder="請輸入驗證碼" :isClose="false" :showLabel="false" />
    <TextInput v-model="modelFormVal.password" name="password" label="密碼" :type="passwordViewType.password" :isClose="false" placeholder="請輸入6-12碼英文加數字的密碼">
      <template #backIcon>
        <div @click.prevent="passwordViewType.password === 'password' ? passwordViewType.password = 'text' : passwordViewType.password = 'password'" class="absolute top-0 right-0 w-50px h-full flex items-center justify-center">
          <fa :icon="passwordViewType.password === 'password' ? 'far fa-eye-slash' : 'far fa-eye'" class="cursor-pointer select-none" />
        </div>
      </template>
    </TextInput>
    <TextInput v-model="modelFormVal.confirmPassword" name="confirmPassword" rules="confirmed:password" :isClose="false" label="確認密碼" :type="passwordViewType.confirmPassword" placeholder="請再次輸入密碼">
      <template #backIcon>
        <div @click.prevent="passwordViewType.confirmPassword === 'password' ? passwordViewType.confirmPassword = 'text' : passwordViewType.confirmPassword = 'password'" class="absolute top-0 right-0 w-50px h-full flex items-center justify-center">
          <fa :icon="passwordViewType.confirmPassword === 'password' ? 'far fa-eye-slash' : 'far fa-eye'" class="cursor-pointer select-none" />
        </div>
      </template>
    </TextInput>
    <button title="登入" class=" bg-main_orange text-#fff rounded-100px h-40px ">
      <h5>確定</h5>
    </button>
  </form>
</template>
