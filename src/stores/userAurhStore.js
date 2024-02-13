// user資料處理
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { SET_COOKIES, REMOVE_COOKIES } from '../utils/js-cookie';

// user-auth-store唯一值(自己命名)
export const setupUserAuthStore = defineStore('user-auth-store', () => {
  /** @const { Array } 簡易使用者資訊 */
  const SimpleUserInfo = ref([]);

  /** @const { Array } 完整使用者資訊 */
  const AllUserInfo = ref([]);

  /** @const { String } 令牌 */
  const userAccessToken = ref('');

  /** @func 將簡易使用者資訊存進SimpleUserInfo物件當中 ( 含令牌 ) */
  function FN_SETUP_SimpleUSERINFO(respUserInfo) {
    return new Promise((resolve) => {
      userAccessToken.value = respUserInfo.accessToken;
      SimpleUserInfo.value = respUserInfo || {};
      resolve(); // resolve才會把異步的任務作結束 resolve 、reject 方法
    });
  }

  /** @func 將完整使用者資訊存進AllUserInfo物件當中 */
  function FN_SETUP_AllUSERINFO(respUserInfo) {
    return new Promise((resolve) => {
      AllUserInfo.value = respUserInfo || {};
      resolve(); // resolve才會把異步的任務作結束 resolve 、reject 方法
    });
  }

  /** @func 把token存進userAccessToken變數跟cookie */
  function FN_SETUP_ACCESSTOKEN(token) {
    return new Promise((resolve) => {
      userAccessToken.value = token;
      SET_COOKIES(token);
      resolve();
    });
  }

  function FN_LOGOUT() {
    return new Promise((resolve) => {
      FN_SETUP_ACCESSTOKEN('');
      FN_SETUP_SimpleUSERINFO([]);
      userAccessToken.value = '';
      FN_SETUP_AllUSERINFO([]);
      REMOVE_COOKIES();
      resolve();
    });
  }
  return {
    SimpleUserInfo,
    AllUserInfo,
    userAccessToken,
    FN_LOGOUT,
    FN_SETUP_ACCESSTOKEN,
    FN_SETUP_SimpleUSERINFO,
    FN_SETUP_AllUSERINFO,
  };
});
