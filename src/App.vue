<script setup>
import { Header, Footer } from '@/components/layouts/index';

</script>

<template>
    <div class=" flex flex-col min-h-100vh ">
        <Header/>
        <router-view v-slot="{ Component, route }">
        <transition name="fade" mode="out-in">
            <div :key="route.name" class=" flex-1 ">
            <component :is="Component"></component>
            </div>
        </transition>
        </router-view>
        <Footer/>
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
