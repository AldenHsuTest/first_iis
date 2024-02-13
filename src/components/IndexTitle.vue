<script setup>

</script>

<template>
  <img src="/images/index/indexHeader.svg" alt="#" class=" w-408px " >
  <div class=" flex justify-center items-center w-full min-w-auto ">
    <div class=" bg-main_orange h-1px w-20% max-w-153px mr-5px sm:mr-10px relative after:absolute after:right-0px after:top--3px after:content-[''] after:bg-main_orange after:w-8px after:h-8px after:rounded-100% "></div>
    <h1 class=" text-30px text-center text-main_orange font-700 w-auto">
      <slot name="title"></slot>
    </h1>
    <div class=" bg-main_orange h-1px w-20% max-w-153px ml-5px sm:ml-10px relative before:absolute before:left-0px before:top--3px before:content-[''] before:bg-main_orange before:w-8px before:h-8px before:rounded-100% "></div>
  </div>
</template>
