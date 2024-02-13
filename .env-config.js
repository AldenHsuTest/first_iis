// 專為環境代理設定
// 根據不同環境的設定 透過 build 引入 最後由vite.config實作
const serviceEnv = { 
  dev: {
    url: 'http://sbir.cbsdinfo.com.tw',
    urlPattern: '/service/api',
  },
  prod: {
    url: 'http://sbir.cbsdinfo.com.tw',
    urlPattern: '/service/api',
  }
};

/**
* @param env 環境檔
*/
export function getServiceEnvConfig(env) {
  const { VITE_SERVICE_ENV = 'dev' } = env;

  const config = serviceEnv[VITE_SERVICE_ENV];

  return config;
}
 