<script setup>
import Navbar from './components/UI/Navbar.vue';
</script>

<template>
  <img alt="Moe Counter" style="display: none;"
    src="https://count.getloli.com/@LoXidEv?name=LoXidEv&theme=booru-ve&padding=7&offset=0&align=top&scale=1&pixelated=1&darkmode=auto">
  <img src="/img/DoNG/DoNG_Bg3.webp" alt="Banner" class="dc_bg_full">
  <div class="loxi_page">
    <div class="loxi_width">
      <RouterView v-slot="{ Component }">
        <Transition name="page" mode="out-in">
          <component :is="Component" :key="$route.path" />
        </Transition>
      </RouterView>
    </div>
  </div>
  <Navbar />
</template>

<style>
.dc_bg_full {
  position: fixed;
  top: 0;
  left: 0;
  z-index: -1;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

@media screen and (min-width: 1240px) {
  .loxi_width {
    width: 60% !important;
  }
}

.loxi_width {
  width: 100%;
  padding: 20px 20px 100px 20px;
}

.loxi_page {
  background-color: var(--background-color-oc);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  width: 100%;
}
</style>
