import {
  Field, Form, ErrorMessage, configure,
} from 'vee-validate';
import { localize, setLocale } from '@vee-validate/i18n';
import zhTW from '@vee-validate/i18n/dist/locale/zh_TW.json';
import './rules';

configure({
  generateMessage: localize({ zh_TW: zhTW }),
  validateOnInput: true,
});
setLocale('zh_TW');

export function setupVeeValidator(AppInstance) {
  AppInstance.component('V-Field', Field);
  AppInstance.component('V-Form', Form);
  AppInstance.component('V-ErrMsg', ErrorMessage);
}
