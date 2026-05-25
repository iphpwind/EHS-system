<template>
  <div class="sidebar-logo-container" :class="{ 'collapse': collapse }"
       :style="{ backgroundColor: sideTheme === 'theme-dark' ? variables.menuBackground : variables.menuLightBackground }">
    <transition name="sidebarLogoFade">
      <router-link v-if="collapse" key="collapse" class="sidebar-logo-link" to="/">
        <img v-if="logo" :src="logos" class="sidebar-logo"/>
      </router-link>
      <router-link v-else key="expand" class="sidebar-logo-link" to="/">
        <img v-if="logo" :src="logos" class="sidebar-logo"/>
        <h1 v-if="title" class="sidebar-title"
            :style="{ color: sideTheme === 'theme-dark' ? variables.logoTitleColor : variables.logoLightTitleColor }">
          {{ title }}
        </h1>
      </router-link>
    </transition>
  </div>
</template>

<script setup>
import variables from '@/assets/styles/variables.module.scss'
import defaultLogo from '@/assets/logo/logo.png'
import { useSettingsStore } from '@/store/modules/settings'

defineProps({
  collapse: {
    type: Boolean,
    required: true
  }
})

const settingsStore = useSettingsStore()
const title = computed(() => settingsStore.siteName || '安全生产管理系统');
const sideTheme = computed(() => settingsStore.sideTheme);
// 优先使用后台配置的Logo，没有则使用默认logo.png
const logos = computed(() => settingsStore.siteLogo || defaultLogo);
</script>

<style lang="scss" scoped>
@import "@/assets/styles/variables.module.scss";

.sidebarLogoFade-enter-active {
  transition: opacity 0.6s ease;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: 56px;
  line-height: 56px;
  text-align: center;
  overflow: hidden;
  transition: all 0.3s ease;

  & .sidebar-logo-link {
    height: 100%;
    width: 100%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    text-decoration: none;
    transition: gap 0.3s ease;

    & .sidebar-logo {
      height: 30px;
      vertical-align: middle;
      transition: transform 0.3s ease;
    }

    & .sidebar-title {
      display: inline-block;
      margin: 0;
      font-weight: 600;
      line-height: 56px;
      font-size: 15px;
      vertical-align: middle;
      transition: opacity 0.3s ease, width 0.3s ease;
      white-space: nowrap;
      overflow: hidden;
    }

    &:hover .sidebar-logo {
      transform: scale(1.08);
    }
  }

  &.collapse {
    .sidebar-logo-link {
      gap: 0;
    }
    .sidebar-logo {
      margin-right: 0px;
    }
    .sidebar-title {
      display: none;
    }
  }
}
</style>
