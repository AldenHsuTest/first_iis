import { FETCH_AUTH } from '@/service';// 登入post資料並取的使用者資訊
import { setupUserAuthStore } from '../stores/userAurhStore'; // stores資料夾/userAuthStore的方法(pinia)
import { GET_COOKIES } from '../utils/js-cookie';

/** @func 設定路由權限 */
export function setupRoutePermission(routerInstane) {
  routerInstane.beforeEach(async (to, from) => {
    const USER_TOKEN = GET_COOKIES();

    if (to.path === '/Login') {
      if (USER_TOKEN) {
        const LoginInfoResp = await FETCH_AUTH.GetLoginInfo();
        const { error } = LoginInfoResp;
        if (!error) {
          return from.path ? from.path : '/';
        }
        return true;
      }
      return true;
    }

    const whiteList = ['/Login', '/Signup', '/Forget'];
    const userStore = setupUserAuthStore();
    if (to.meta.requireAuth) {
      if (!USER_TOKEN && !whiteList.includes(to.path)) {
        userStore.FN_LOGOUT();
        return '/Login';
      }
    }

    if (USER_TOKEN) {
      if (whiteList.includes(to.path)) {
        return '/';
      }
      const LoginInfoResp = await FETCH_AUTH.GetLoginInfo();

      const { error, data, status } = LoginInfoResp;

      if (error || !data || status === 401) {
        userStore.FN_LOGOUT();
        return '/Login';
      }
      const userInfo = {
        id: data.id,
        name: data.name,
        account: data.account,
        accessToken: data.accessToken,
      };
      userStore.FN_SETUP_SimpleUSERINFO(userInfo);
      const UserProfileResp = await FETCH_AUTH.GetProfile();
      userStore.FN_SETUP_AllUSERINFO(UserProfileResp.data);
    }
    return true;
  });
}
