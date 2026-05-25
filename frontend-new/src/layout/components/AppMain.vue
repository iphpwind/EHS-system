<template>
  <section class="app-main">
    <router-view v-slot="{ Component, route }">
      <transition name="fade-transform" mode="out-in">
        <keep-alive :include="cachedViews">
          <component :is="Component" :key="route.path"/>
        </keep-alive>
      </transition>
    </router-view>
  </section>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import { useTagsViewStore } from '@/store/modules/tagsView'

const route = useRoute()
const tagsViewStore = useTagsViewStore()

// 添加缓存视图
tagsViewStore.addCachedView(route)

const cachedViews = computed(() => {
  return tagsViewStore.cachedViews
})
</script>

<style lang="scss" scoped>
.app-main {
  /* 50= navbar  50  */
  height: 100%;
  width: 100%;
  position: relative;
  overflow: hidden;
}

.fixed-header + .app-main {
  padding-top: 50px;
}

.hasTagsView {
  .app-main {
    /* 84 = navbar + tags-view = 50 + 34 */
    height: calc(100vh - 84px);
    height: calc(100dvh - 84px);
  }

  .fixed-header + .app-main {
    padding-top: 84px;
  }
}

//1366屏幕响应
@media screen and (max-width: 1366px) {
  .hasTagsView {
    .app-main {
      height: auto;
      min-height: calc(100dvh - 84px);
    }
  }
}

// 移动端(< 768px)
@media screen and (max-width: 768px) {
  .app-main {
    -webkit-overflow-scrolling: touch;
  }
  .hasTagsView {
    .app-main {
      min-height: calc(100dvh - 84px);
      height: auto;
    }
  }
  .fixed-header + .app-main {
    padding-top: 44px;
  }
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 17px;
  }
}
</style>
