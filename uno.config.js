import { defineConfig, presetUno, presetAttributify } from 'unocss';

export default defineConfig({
  // ...UnoCSS options
  presets: [presetUno(), presetAttributify()],
  theme: {
    colors: {
      main_orange: 'var( --main-orange )',
    },
    fontSize: {
      h1: '16px',
      h2: '18px',
      h3: '20px',
      h4: '22px',
      h5: '24px',
      h6: '26px',
      p: '14px',
    },
    breakpoints: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
    },
  },
});
