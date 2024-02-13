<script setup>
import { ref, inject, computed } from 'vue';
import { useForm } from 'vee-validate';
import { useRouter } from 'vue-router';
import TextInput from '@/components/common/TextInput.vue';
import UserTitle from '@/components/UserTitle.vue';
import Button from '@/components/common/Button.vue';
import { FETCH_AUTH } from '@/service';
import { setupUserAuthStore } from '@/stores';

const swal = inject('$swal');
const router = useRouter();
const userStore = setupUserAuthStore();
const { SimpleUserInfo } = userStore;

const formValidationSchema = computed(() => ({
  oldPwd: 'required',
  newPwd: 'required|pwdRule',
  confirmPwd: 'required|confirmed:newPwd',
}));

// 表單
const {
  // eslint-disable-next-line no-unused-vars
  handleSubmit, values: modelFormVal, setValues,
} = useForm({
  validationSchema: formValidationSchema,
});

setValues({
  oldPwd: '',
  newPwd: '',
  confirmPwd: '',
});

const pwdType = ref({
  oldPwdType: 'password',
  newPwdType: 'password',
  confirmPwdType: 'password',
});
const onSubmit = handleSubmit(async (values) => {
  const queryForm = {
    userId: SimpleUserInfo.id,
    oldPassword: values.oldPwd,
    newPassword: values.newPwd,
  };

  const { error, success, message } = await FETCH_AUTH.ChangeUserPassword(queryForm);

  if (error) return;
  if (!success) {
    swal.fire({
      icon: 'warning',
      iconColor: '#1E3E8F',
      text: message,
      showConfirmButton: false,
      timer: 1500,
    });
  } else {
    swal.fire({
      icon: 'success',
      iconColor: '#1E3E8F',
      text: '重設密碼成功',
      showConfirmButton: false,
      timer: 1500,
    }).then(() => {
      router.push('/Info');
    });
  }
});

</script>

<template>
  <UserTitle title="重設密碼"></UserTitle>

  <form @submit.prevent="onSubmit()" class=" w-90% max-w-440px flex flex-col ">
    <TextInput name="oldPwd" label="原密碼" :type="pwdType.oldPwdType" :isClose="false" placeholder="請輸入原密碼">
      <template #backIcon>
        <fa @click="pwdType.oldPwdType === 'password' ? pwdType.oldPwdType = 'text' : pwdType.oldPwdType = 'password'" :icon="pwdType.oldPwdType === 'password' ? 'far fa-eye-slash' : 'far fa-eye'" class="cursor-pointer select-none p-10px" />
      </template>
    </TextInput>
    <TextInput name="newPwd" label="新密碼" :type="pwdType.newPwdType" :isClose="false" placeholder="請輸入6-12碼英文加數字的密碼">
      <template #backIcon>
        <fa @click="pwdType.newPwdType === 'password' ? pwdType.newPwdType = 'text' : pwdType.newPwdType = 'password'" :icon="pwdType.newPwdType === 'password' ? 'far fa-eye-slash' : 'far fa-eye'" class="cursor-pointer select-none p-10px" />
      </template>
    </TextInput>
    <TextInput name="confirmPwd" label="確認密碼" :type="pwdType.confirmPwdType" :isClose="false" placeholder="請再次輸入密碼">
      <template #backIcon>
        <fa @click="pwdType.confirmPwdType === 'password' ? pwdType.confirmPwdType = 'text' : pwdType.confirmPwdType = 'password'" :icon="pwdType.confirmPwdType === 'password' ? 'far fa-eye-slash' : 'far fa-eye'" class="cursor-pointer select-none p-10px" />
      </template>
    </TextInput>
    <div class=" flex gap-15px ">
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
