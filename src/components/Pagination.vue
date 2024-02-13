<script setup>
import {
  ArrowLeftBold, ArrowRightBold,
} from '@element-plus/icons-vue';
import {
  defineProps, toRef, defineEmits, watch, ref, onMounted,
} from 'vue';

/*  el-pagination 參數
    pager-count：設置最大頁碼按鈕數，預設為超過 7 頁即摺疊 ( 與 total 擇一設置 )
    total：數據總數
    page-sizes：每頁有幾筆數據的按鈕，預設為 10
    hide-on-single-page: 只有一頁時隱藏分頁
    v-model:current-page：當前頁數
*/

// 當螢幕寬度 < 768時調整Pagination大小( 開始 )
const screenWidth = ref(window.innerWidth);
const phoneSize = ref(false);
watch(
  screenWidth,
  (newWidth) => {
    if (newWidth < 768) {
      phoneSize.value = true;
    } else {
      phoneSize.value = false;
    }
  },
);

window.addEventListener('resize', () => {
  screenWidth.value = window.innerWidth;
});

onMounted(() => {
  if (screenWidth.value < 768) {
    phoneSize.value = true;
  } else {
    phoneSize.value = false;
  }
});
// 當螢幕寬度 < 768時調整Pagination大小( 結束 )

// 每頁面筆數
const props = defineProps({
  modelValue: { // currentPage
    type: Number,
    default: () => 0,
  },
  pageLimit: {
    type: Array,
    default: () => [10, 20, 30],
  },
  totalData: {
    type: Number,
    default: () => 0,
  },
});

const currentPage = toRef(props, 'modelValue'); // 當前頁數
const totalData = toRef(props, 'totalData'); // 此項目的總數據
const pageLimitRef = toRef(props, 'pageLimit'); // 每個頁面的數據數量

const emit = defineEmits(['update:modelValue']); // 傳出當前頁數值

// 切換頁面時傳出當前頁數值的方法
function handleCurrentChange(val) {
  emit('update:modelValue', val);
}

</script>

<template>
    <el-pagination
      :small="phoneSize"
      background
      layout="prev, pager, next"
      :total="totalData"
      :current-page="currentPage"
      @current-change="handleCurrentChange"
      :page-sizes="pageLimitRef"
      :prev-icon="ArrowLeftBold"
      :next-icon="ArrowRightBold"
      :hide-on-single-page="true"
    />
</template>

<style>
.el-pagination.is-background .btn-next.is-active, .el-pagination.is-background .btn-prev.is-active, .el-pagination.is-background .el-pager li.is-active {
    background-color: #F19700;
    color: #fff;
}

.el-pager li:hover {
    color: #F19700;
}

.el-pagination.is-background .btn-next, .el-pagination.is-background .btn-prev, .el-pagination.is-background .el-pager li {
    background-color: white;
    border: 1px solid #F19700;
    color: #F19700;
    font-weight: bold;
}

.el-pagination button:hover {
    color: #F19700;
}

.el-pagination.is-background .btn-next.is-disabled, .el-pagination.is-background .btn-next:disabled, .el-pagination.is-background .btn-prev.is-disabled, .el-pagination.is-background .btn-prev:disabled, .el-pagination.is-background .el-pager li.is-disabled, .el-pagination.is-background .el-pager li:disabled {
    color: #fff;
    background-color: #F19700;
}

</style>
