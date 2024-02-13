<script setup>
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { setupUserAuthStore } from '@/stores';

/** @const { Object } 從pinia取得使用者資訊 */
const isUser = setupUserAuthStore();

/** @func pinia登出用方法 */
const { FN_LOGOUT } = setupUserAuthStore();

/** @const { Object } router導向 */
const router = useRouter();

// 把存在pinia的變數用storeToRefs讓他保持響應
const { SimpleUserInfo } = storeToRefs(isUser);

/** @const { String } 使用者名稱 */
const username = computed(() => (SimpleUserInfo.value ? SimpleUserInfo.value.name : ''));

/** @const {Boolean} 控制手機板nav開關 */
const isOpen = ref(false);

/** @const {Boolean} 會員表單nav開關 */
const isMember = ref(false);

/** @const {Boolean} */
// const ismenuCategory = ref(false);

/** @func 登出 */
function logout() {
  isOpen.value = !isOpen.value;
  FN_LOGOUT();
  router.push('/');
}

/** @const {Array} 未登入nav */
const menuList = ref([
  { id: 1, lable: '接駁服務', router: '/' },
  { id: 2, lable: '訂單查詢', router: '/Record' },
]);

/** @const {Array} 會員登入資料nav */
const memberList = ref([
  { id: 1, lable: '個人資料', router: '/Info' },
  { id: 2, lable: '歷史訂單', router: '/Record' },
]);

</script>

<template>
  <section>
    <div class=" w-full m-[0_auto] p-y-27.5px p-l-1.9rem p-r-0.6rem flex bg-main_orange justify-between md:p-y-22px  md:p-x-30px " :class=" [ isOpen ? 'hidden' : 'block' ] ">
      <!-- 電腦版選單 -->
      <router-link to="/" title="前往接駁服務頁面" >
        <h3 class=" text-#fff " >長照整合服務自費派遣系統</h3>
      </router-link>
      <img @click=" isOpen = !isOpen " src="/images/header/h_open.svg" alt="#" class=" w-30px h-12px m-10px md:hidden " :class=" [ isOpen ? 'hidden' : 'block' ] ">
      <div class=" hidden md:block ">
        <ul class=" flex gap-25px " >
          <li v-for=" menu in menuList " :key="menu.id" >
            <router-link :to="menu.router" :title="`前往 ${menu.lable} `"  >
              <h5 class=" text-#fff font-500 relative before:hover:absolute before:hover:top-10px before:hover:left--12px before:hover:w-10px before:hover:h-10px before:hover:content-[''] before:hover:bg-[url(/images/header/h_active.svg)] before:hover:bg-no-repeat "
              :class=" [ $route.fullPath === menu.router ? ` before:absolute before:top-10px before:left--12px before:w-10px before:h-10px before:content-[''] before:bg-[url(/images/header/h_active.svg)] before:bg-no-repeat ` : ''] " >{{ menu.lable }}</h5>
            </router-link>
          </li>
          <!-- 登入前( 顯示登入/註冊 ) -->
          <li v-if=" !username " class=" flex gap-10px cursor-pointer ">
            <img src="/images/header/h_login.svg" alt="#" >
            <router-link to="/Login" title="前往登入頁"  >
              <h5 class=" text-#fff font-500 relative ">登入 / 註冊</h5>
            </router-link>
          </li>
          <!-- 登入後( 顯示使用者名稱資訊 ) -->
          <li v-if=" username " class=" relative group " >
            <div class=" flex gap-10px " >
              <div class=" relative after:absolute after:right--3px after:bottom--3px after:content-[''] after:bg-[url(/images/header/h_isLogin.svg)] after:w-16px after:h-16px ">
                <img src="/images/header/h_login.svg" alt="#" >
              </div>
              <h5 class=" text-#fff font-500 ">{{ username }}</h5>
              <img src="/images/header/h_arrow.svg" alt="#" class=" rotate--180 duration-300 group-hover:rotate-0 group-hover:duration-300 " >
            </div>
            <div class=" absolute bg-transparent top-20px w-full h-40px w-150px h-10px pointer-events-none group-hover:pointer-events-auto"></div>
            <ul class=" absolute top-58px left--10px w-126px overflow-y-hidden bg-main_orange rounded-[0_0_10px_10px] h-0 opacity-0 duration-300  group-hover:h-fit group-hover:opacity-100 group-hover:duration-300 "  >
              <li v-for=" member in memberList " :key=" member.id " class=" m-t-20px text-center ">
                <router-link :to="member.router" :title="`前往 ${member.lable} `"  >
                  <h5 class=" text-#fff font-500 relative before:hover:absolute before:hover:top-10px before:hover:left-10px before:hover:w-10px before:hover:h-10px before:hover:content-[''] before:hover:bg-[url(/images/header/h_active.svg)] before:hover:bg-no-repeat "
                  :class=" $route.fullPath === member.router ? `before:absolute before:top-10px before:left-10px before:w-10px before:h-10px before:content-[''] before:bg-[url(/images/header/h_active.svg)] before:bg-no-repeat` : '' ">{{ member.lable }}</h5>
                </router-link>
              </li>
              <li @click="logout" class=" m-t-20px text-center m-b-20px cursor-pointer " >
                <h5 class=" text-#fff font-500 relative before:hover:absolute before:hover:top-10px before:hover:left-10px before:hover:w-10px before:hover:h-10px before:hover:content-[''] before:hover:bg-[url(/images/header/h_active.svg)] before:hover:bg-no-repeat ">登出</h5>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>

    <!-- 手機板選單 -->
    <div class=" fixed top-0 w-full h-screen bg-main_orange md:hidden z-100 " :class=" [ !isOpen ? '!w-0 duration-100 ' : 'w-full duration-100 '] ">
      <div class=" flex justify-end p-t-1rem p-r-0.6rem ">
        <img @click=" isOpen = !isOpen " src="/images/header/h_close.svg" alt="#" class=" w-30px h-30px m-x-10px m-y-5px ">
      </div>
      <ul class=" relative top-42px flex flex-col items-center overflow-x-hidden ">
        <h3 class="  text-#fff text-center m-b-45px font-bold tracking-0.44px " >銀髮交通自費接駁系統</h3>
        <li v-for=" menu in menuList " :key="menu.id" class=" m-b-45px">
          <router-link @click=" isOpen = !isOpen " :to="menu.router" :title="`前往 ${menu.lable} `"  >
            <h5 class=" text-#fff font-500 relative before:hover:absolute before:hover:top-10px before:hover:left--15px before:hover:w-10px before:hover:h-10px before:hover:content-[''] before:hover:bg-[url(/images/header/h_active.svg)] before:hover:bg-no-repeat ">{{ menu.lable }}</h5>
          </router-link>
        </li>
        <!-- 登入前( 顯示登入/註冊 ) -->
        <li v-if=" !username " class=" flex gap-10px cursor-pointer ">
          <img src="/images/header/h_login.svg" alt="#" >
          <router-link @click=" isOpen = !isOpen " to="/Login" title="前往登入頁"   >
            <h5 class=" text-#fff font-500 relative ">登入 / 註冊</h5>
          </router-link>
        </li>
        <!-- 登入後( 顯示使用者名稱資訊 ) -->
        <li v-if=" username ">
          <div @click=" isMember = !isMember " class=" flex gap-10px m-b-30px " >
            <div class=" relative after:absolute after:right--3px after:bottom--3px after:content-[''] after:bg-[url(/images/header/h_isLogin.svg)] after:w-16px after:h-16px ">
              <img src="/images/header/h_login.svg" alt="#" >
            </div>
            <h5 class=" text-#fff font-500 ">{{ username }}</h5>
            <img src="/images/header/h_arrow.svg" alt="#" :class=" !isMember ? ' rotate--180 duration-300 ' : ' rotate-0 duration-300 ' " >
          </div>
          <ul class=" overflow-y-hidden " :class=" !isMember ? ' h-0 opacity-0 duration-300 ' : ' h-20vh opacity-100 duration-300 ' " >
            <li @click=" isOpen = !isOpen " v-for=" member in memberList " :key=" member.id " class=" m-b-20px text-center ">
              <router-link :to="member.router" :title="`前往 ${member.lable} `"  >
                <h5 class=" text-#fff font-500 relative before:hover:absolute before:hover:top-10px before:hover:left-5px before:hover:w-10px before:hover:h-10px before:hover:content-[''] before:hover:bg-[url(/images/header/h_active.svg)] before:hover:bg-no-repeat ">{{ member.lable }}</h5>
              </router-link>
            </li>
            <li @click="logout" class=" m-b-20px text-center " >
              <h5 class=" text-#fff font-500 relative before:hover:absolute before:hover:top-10px before:hover:left-10px before:hover:w-10px before:hover:h-10px before:hover:content-[''] before:hover:bg-[url(/images/header/h_active.svg)] before:hover:bg-no-repeat ">登出</h5>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </section>
</template>

<style>

</style>
