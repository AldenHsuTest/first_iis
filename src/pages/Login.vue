<script setup>
import { ref, inject } from 'vue';
import { useForm } from 'vee-validate';
import { useRouter } from 'vue-router';
import TextInput from '@/components/common/TextInput.vue';
import Button from '@/components/common/Button.vue';
import UserTitle from '@/components/UserTitle.vue';
import { setupUserAuthStore } from '../stores/userAurhStore';
import { FETCH_AUTH } from '../service';

const Swal = inject('$swal');

// 把router的方法放進變數裡
const router = useRouter();

// 把創建好的pinia方法放進變數
const userAuthStore = setupUserAuthStore();

// 從pinia取方法出來用
const { FN_SETUP_ACCESSTOKEN } = userAuthStore;

/** @const Object 密碼type */
const passwordViewType = ref({
  password: 'password',
});

/** @func vee-validate驗證規則 ( rules.js ) */
const formValidationSchema = {
  account: 'required',
  password: 'required',
};

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
  account: '',
  password: '',
});

/** @func 登入取得Token存進pinia跟cookie */
const onSubmit = handleSubmit(async (values) => {
  const {
    data, error, message, success,
  } = await FETCH_AUTH.Login(values);

  if (error) return;

  if (success) {
    const { accessToken } = data;

    await FN_SETUP_ACCESSTOKEN(accessToken);
    Swal.fire({
      icon: 'success',
      text: '登入成功',
      timer: 3000,
      timerProgressBar: true,
      showConfirmButton: false,
    }).then(() => {
      router.push('/');
    });
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

</script>

<template>
    <UserTitle title="登入"></UserTitle>

    <form @submit.prevent="onSubmit()" class=" w-90% max-w-440px flex flex-col gap-30px">
      <TextInput v-model="modelFormVal.account" name="account" label="帳號" type="text" placeholder="請輸入帳號" />
      <TextInput v-model="modelFormVal.password" name="password" label="密碼" :type="passwordViewType.password" :isClose="false" placeholder="請輸入6-12碼英文加數字的密碼">
        <template #backIcon>
          <div @click.prevent="passwordViewType.password === 'password' ? passwordViewType.password = 'text' : passwordViewType.password = 'password'" class="absolute top-0 right-0 w-50px h-full flex items-center justify-center">
            <fa :icon="passwordViewType.password === 'password' ? 'far fa-eye-slash' : 'far fa-eye'" class="cursor-pointer select-none" />
          </div>
        </template>
      </TextInput>
      <Button title="登入" move="right">
        <template #title>
          <h5>登入</h5>
        </template>
      </Button>
      <Button title="前往忘記密碼頁面" move="right" routerProp="/Forget" class=" !bg-transparent !border !border-solid !border-main_orange !text-main_orange " >
        <template #title>
          <h5>忘記密碼</h5>
        </template>
      </Button>
      <div class=" flex justify-end gap-10px mt-20px ">
        <h5 class=" text-#9E9E9E ">還沒加入會員?</h5>
        <router-link to="/Signup" title="前往註冊頁面" class=" text-18px text-#297494 text-center ">
          前往註冊
        </router-link>
      </div>
    </form>
</template>
