module.exports = {
  root: true,
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  settings: {
    // 讓 ESLint 可以正常解析 @ 的路徑，因為我們在 vite.config.js 裡面有設定 @ 的路徑
    'import/resolver': {
      alias: {
        map: [
          ['@', './src'],
          ['~', './'],
        ],
        extensions: ['.js', '.vue'],
      },
    },
    // 告訴 ESLint 這些套件是安裝在 devDependencies
    'import/core-modules': [
      'vite',
      '@vitejs/plugin-vue',
      'unocss',
      'unocss/vite',
    ],
  },
  rules: {
    'import/prefer-default-export': 'off',
    'vue/multi-word-component-names': [0],
    'max-len': [0], // warn, maximum length of 80, tab width 4  max-len: [1, 80, 4]
    'no-plusplus': 'off', // eslint-disable-next-line no-plusplus
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
      },
    ],
    'import/no-extraneous-dependencies': [0],
    'no-console': 'off',
    // 關閉 camelcase 檢查不然如果 alpha_num 的變數報錯誤訊錫
    'camelcase': 'off',
    'linebreak-style': ["off", "windows"], 
  },
};
