import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import { defineRule } from 'vee-validate';
import {
  email, required, min, max, alpha_num, numeric, integer, min_value, max_value, is, is_not,
} from '@vee-validate/rules';

dayjs.extend(duration);
dayjs.extend(relativeTime);

defineRule('required', required);
defineRule('email', email);
defineRule('min', min);
defineRule('min_value', min_value);
defineRule('max', max);
defineRule('max_value', max_value);
defineRule('numeric', numeric);
defineRule('integer', integer);
defineRule('alpha_num', alpha_num);
defineRule('is', is);
defineRule('is_not', is_not);

// 帳號驗證
defineRule('accountRule', (value, target, ctx) => {
  if (!/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{5,20}$/.test(value)) {
    return `${ctx.field}格式錯誤`;
  }
  return true;
});

// 密碼第一次驗證
defineRule('pwdRule', (value, target, ctx) => {
  if (!/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,12}$/.test(value)) {
    return `${ctx.field}格式錯誤`;
  }
  return true;
});

// 確認密碼驗證
defineRule('confirmed', (value, [target], ctx) => {
  if (value === ctx.form[target]) {
    return true;
  }
  return '確認密碼與密碼不符';
});

// 手機驗證
defineRule('mobile', (val, target, ctx) => {
  if (!/^09\d{8}$/.test(val)) {
    return `${ctx.field}有誤`;
  }
  return true;
});

// 市話驗證
defineRule('telephone', (val, target, ctx) => {
  if (!/(\d{2,3}-?|\(\d{2,3}\))\d{3,4}-?\d{4}/.test(val)) {
    return `${ctx.field}有誤`;
  }
  const phoneNumber = val.replace(/[-()]/g, ''); // 去除分隔符
  if (phoneNumber.length < 9 || phoneNumber.length > 11) {
    return `${ctx.field}有誤`;
  }
  return true;
});

// 身分證驗證
defineRule('idNum', (value, target, ctx) => {
  if (value && !/^[A-Z](1|2)\d{8}$/.test(value)) return `${ctx.field}有誤`;
  const city = [1, 10, 19, 28, 37, 46, 55, 64, 39, 73, 82, 2, 11, 20, 48, 29, 38, 47, 56, 65, 74, 83, 21, 3, 12, 30];
  if (value) {
    let total = city[value.charCodeAt(0) - 65];
    // eslint-disable-next-line no-plusplus
    for (let i = 1; i <= 8; i++) {
      total += value.charAt(i) * (9 - i);
    }
    total += value.charAt(9) * 1;
    return total % 10 === 0 || true;
  }
  return true;
});

// 包車時數驗證
defineRule('charterHoursRule', (value, [reserveDate]) => {
  if (reserveDate >= 18 && value >= 5) {
    return '包車時數超過營業時間';
  } if (reserveDate > 18 && value >= 4) {
    return '包車時數超過營業時間';
  } if (reserveDate === '00' && value >= 4) {
    return '包車時數超過營業時間';
  }

  return true;
});

// 練續假日14天前訂車驗證
defineRule('getOnRule', (value, [isconsecutiveHolidays]) => {
  if (isconsecutiveHolidays === 'true') {
    const selectedDate = dayjs(value);
    const currentDate = dayjs();

    // 计算日期差距
    const daysDifference = selectedDate.diff(currentDate, 'day');
    if (daysDifference < 13) {
      return '連續假期須於14天前預訂';
    }
  }

  return true; // 满足条件，返回 true
});

// 驗證上車地點
defineRule('checkBoardingArea', (value, [boardingArea]) => {
  if (boardingArea === '台北') {
    if (value.includes(boardingArea) || value.includes('臺北')) {
      return true;
    }
    return '上車地點與上車地區不符';
  }

  if (boardingArea === '台東') {
    if (value.includes(boardingArea) || value.includes('臺東')) {
      return true;
    }
    return '上車地點與上車地區不符';
  }

  if (boardingArea === '台中') {
    if (value.includes(boardingArea) || value.includes('臺中')) {
      return true;
    }
    return '上車地點與上車地區不符';
  }

  if (!value.includes(boardingArea)) {
    return '上車地點與上車地區不符';
  }
  return true;
});
