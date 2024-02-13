<script setup>
</script>

<template>
  <div class=" w-90% m-[0_auto] p-y-100px max-w-1440px min-h-[calc(100vh-417px)] md:min-h-[calc(100vh-406px)] xl:p-x-0">
    <div class=" flex flex-col items-center gap-50px ">
      <router-view/>
    </div>
  </div>
</template>

<style>
  .fade-enter {
    opacity: 0;
  }

  .fade-leave{
    opacity: 1;
  }

  .fade-enter-active{
    transition: all 0.3s;
  }

  .fade-leave-active{
    opacity: 0;
    transition: all 0.3s;
  }
</style>
