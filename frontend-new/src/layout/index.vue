<template>
  <div :class="classObj" class="app-wrapper" :style="{ '--current-color': theme }">
    <div v-if="device === 'mobile' && sidebar.opened" class="drawer-bg" @click="handleClickOutside"/>

    <sidebar v-if="!sidebar.hide" class="sidebar-container"/>

    <div :class="{ hasTagsView: needTagsView, sidebarHide: sidebar.hide }" class="main-container">

      <div :class="{ 'fixed-header': fixedHeader }" v-if="hide">
        <navbar @setLayout="setLayout"/>
        <tags-view v-if="needTagsView"/>
      </div>

      <app-main/>
      <settings ref="settingRef"/>
    </div>

  </div>
</template>

<script setup>
import {useWindowSize} from '@vueuse/core'
import Sidebar from './components/Sidebar/index.vue'
import {AppMain, Navbar, Settings, TagsView} from './components'
import defaultSettings from '@/settings'

const store = useStore();
const route = useRoute();
const theme = computed(() => store.state.settings.theme);
const sidebar = computed(() => store.state.app.sidebar);
const device = computed(() => store.state.app.device);
const needTagsView = computed(() => store.state.settings.tagsView);
const fixedHeader = computed(() => store.state.settings.fixedHeader);

const hide = computed(() => {
  const h = store.state.app.hide;
  return h !== false;
});

const classObj = computed(() => ({
  hideSidebar: !sidebar.value.opened,
  openSidebar: sidebar.value.opened,
  withoutAnimation: sidebar.value.withoutAnimation,
  mobile: device.value === 'mobile'
}))

const {width} = useWindowSize();
const WIDTH = 992;

watchEffect(() => {
  if (device.value === 'mobile' && sidebar.value.opened) {
    store.dispatch('app/closeSideBar', {withoutAnimation: false})
  }
  if (width.value - 1 < WIDTH) {
    store.dispatch('app/toggleDevice', 'mobile')
    store.dispatch('app/closeSideBar', {withoutAnimation: true})
  } else {
    store.dispatch('app/toggleDevice', 'desktop')
  }
})

// 通过路由 meta 驱动布局显示/隐藏
watch(() => route.path, () => {
  const meta = route.meta || {}
  // 控制顶部导航显示/隐藏
  const hideTop = meta.hideTop === true
  store.dispatch('app/topHide', !hideTop).catch(() => {})
  // 控制侧边栏显示/隐藏（若 meta 中有 hideSidebar）
  if (meta.hideSidebar === true) {
    store.dispatch('app/toggleSideBarHide', true).catch(() => {})
  } else if (meta.hideSidebar === false) {
    store.dispatch('app/toggleSideBarHide', false).catch(() => {})
  }
}, { immediate: true });

function handleClickOutside() {
  store.dispatch('app/closeSideBar', {withoutAnimation: false})
}

const settingRef = ref(null);

function setLayout() {
  settingRef.value.openSetting();
}
</script>

<style lang="scss" scoped>
@import "@/assets/styles/mixin.scss";
@import "@/assets/styles/variables.module.scss";

.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
  background: $gray-100;

  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}

.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - #{$base-sidebar-width});
  transition: width 0.28s;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}

.hideSidebar .fixed-header {
  width: calc(100% - #{$base-sidebar-collapsed-width});
}

.sidebarHide .fixed-header {
  width: 100%;
}

.mobile .fixed-header {
  width: 100%;
}
</style>
