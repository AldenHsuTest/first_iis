import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';

export function setupDatepicker(AppInstance) {
  AppInstance.component('Datepicker', Datepicker);
}
