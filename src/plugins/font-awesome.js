// font-awesome
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';

// regular src
import {
  faEye,
  faEyeSlash,
} from '@fortawesome/free-regular-svg-icons';

// regular
library.add(
  faEye,
  faEyeSlash,
);

export function setupFontAwesome(AppInstance) {
  AppInstance.component('fa', FontAwesomeIcon);
}
