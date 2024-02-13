<script setup>
import { toRef } from 'vue';

const props = defineProps({
  title: {
    type: String,
  },
  routerProp: {
    type: String,
    default: '',
  },
  icon: {
    type: String,
  },
  move: {
    type: String,
  },
  class: {
    type: String,
  },
});

const titleRef = toRef(props, 'title');
// const iconRef = toRef(props, 'icon');
const classRef = toRef(props, 'class');
const moveRef = toRef(props, 'move');

</script>

<template>
  <!-- 不送API單純跳轉頁面 -->
  <router-link v-if="routerProp" :to="routerProp" :title="titleRef"
    class=" group flex justify-center items-center gap-10px bg-main_orange text-#fff rounded-100px h-40px"
    :class="classRef"
  >
    <img v-if=" moveRef === 'left' " src="/public/images/arrowOrange.svg" alt="" class=" duration-300 group-hover:translate-x--10px group-hover:duration-300 ">
    <img v-if=" moveRef === 'rotate' "  src="/public/images/arrowRotate.svg" alt="" class=" duration-300 group-hover:rotate-45 group-hover:duration-300 ">
    <slot name="title"></slot>
    <img v-if=" moveRef === 'right' " src="/public/images/arrowWhite.svg" alt="" class=" duration-300 group-hover:translate-x-10px group-hover:duration-300 ">
  </router-link>

  <!-- 送API -->
  <button v-if="!routerProp" :title="titleRef"
    class=" group flex justify-center items-center gap-10px bg-main_orange text-#fff rounded-100px h-40px "
    :class="classRef"
    >
    <img v-if=" moveRef === 'left' " src="/public/images/arrowOrange.svg" alt="" class=" duration-300 group-hover:translate-x--10px group-hover:duration-300 ">
    <img v-if=" moveRef === 'rotate' "  src="/public/images/arrowRotate.svg" alt="" class=" duration-300 group-hover:rotate-45 group-hover:duration-300 ">
    <slot name="title"></slot>
    <img v-if=" moveRef === 'right' " src="/public/images/arrowWhite.svg" alt="" class=" duration-300 group-hover:translate-x-10px group-hover:duration-300 ">
  </button>
</template>
