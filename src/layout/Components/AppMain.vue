<template>
  <section class="app-main">
    <router-view v-slot="{ Component, route }" :key="key">
      <transition name="fade-transform" mode="out-in">
        <keep-alive :include="caches">
          <component :is="Component" :key="route.path" />
        </keep-alive>
      </transition>
    </router-view>
  </section>
</template>

<script setup lang="ts">
import { useKeepAliver } from '../../store/keepAlive'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router';
import { computed } from 'vue';

const { caches } = storeToRefs(useKeepAliver())
const route = useRoute()
const key = computed(()=>{
  return route.path + Math.random()
})
</script>

<style lang="scss" scoped>
.app-main {
  height: 100%;
  width: 100%;
  position: relative;
  overflow: hidden;
  padding: 5px;
}
</style>
