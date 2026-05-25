<template>
  <div class="topnav-scroll">
    <el-menu
        :default-active="activeMenu"
        mode="horizontal"
        @select="handleSelect"
        class="topnav-menu"
    >
      <template v-for="(item, index) in topMenus" :key="index">
        <el-menu-item :style="{'--theme': theme}" :index="item.path">
          <svg-icon :icon-class="item.meta.icon"/>
          {{ item.meta.title }}
        </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>

<script setup>
import {constantRoutes} from "@/router"
import {isHttp} from '@/utils/validate'

// 当前激活菜单的 index
const currentIndex = ref(null);
// 隐藏侧边栏路由
const hideList = ['/index', '/user/profile'];

const appStore = useAppStore()
const settingsStore = useSettingsStore()
const permissionStore = usePermissionStore()
const route = useRoute();
const router = useRouter();

// 主题颜色
const theme = computed(() => settingsStore.theme);
// 所有的路由信息
const routers = computed(() => permissionStore.topbarRouters);

// 顶部显示菜单
const topMenus = computed(() => {
  let topMenus = [];
  routers.value.map((menu) => {
    if (menu.hidden !== true) {
      // 兼容顶部栏一级菜单内部跳转
      if (menu.path === "/") {
        topMenus.push(menu.children[0]);
      } else {
        topMenus.push(menu);
      }
    }
  })
  return topMenus;
})

// 设置子路由
const childrenMenus = computed(() => {
  let childrenMenus = [];
  routers.value.map((router) => {
    for (let item in router.children) {
      if (router.children[item].parentPath === undefined) {
        if (router.path === "/") {
          router.children[item].path = "/" + router.children[item].path;
        } else {
          if (!isHttp(router.children[item].path)) {
            router.children[item].path = router.path + "/" + router.children[item].path;
          }
        }
        router.children[item].parentPath = router.path;
      }
      childrenMenus.push(router.children[item]);
    }
  })
  return constantRoutes.concat(childrenMenus);
})

// 默认激活的菜单
const activeMenu = computed(() => {
  const path = route.path;
  let activePath = path;
  if (path !== undefined && path.lastIndexOf("/") > 0 && hideList.indexOf(path) === -1) {
    const tmpPath = path.substring(1, path.length);
    activePath = "/" + tmpPath.substring(0, tmpPath.indexOf("/"));
    appStore.setSidebarHide(false);
  } else if (!route.children) {
    activePath = path;
    appStore.setSidebarHide(true);
  }
  activeRoutes(activePath);
  return activePath;
})

function handleSelect(key, keyPath) {
  currentIndex.value = key;
  const route = routers.value.find(item => item.path === key);
  if (isHttp(key)) {
    // http(s):// 路径新窗口打开
    window.open(key, "_blank");
  } else if (!route || !route.children) {
    // 没有子路由路径内部打开
    router.push({path: key});
    appStore.setSidebarHide(true);
  } else {
    // 显示左侧联动菜单
    activeRoutes(key);
    appStore.setSidebarHide(false);
  }
}

function activeRoutes(key) {
  let routes = [];
  if (childrenMenus.value && childrenMenus.value.length > 0) {
    childrenMenus.value.map((item) => {
      if (key == item.parentPath || (key == "index" && "" == item.path)) {
        routes.push(item);
      }
    });
  }
  if (routes.length > 0) {
    permissionStore.sidebarRouters = routes;
  }
  return routes;
}
</script>

<style lang="scss">
.topnav-scroll {
  flex: 1;
  min-width: 0;
  overflow-x: auto;
  overflow-y: hidden;

  &::-webkit-scrollbar {
    height: 0;
  }
}

.topnav-menu.el-menu--horizontal {
  display: flex;
  flex-wrap: nowrap;
  border-bottom: none;

  > .el-menu-item {
    float: none;
    flex-shrink: 0;
    height: 50px !important;
    line-height: 50px !important;
    color: #999093 !important;
    padding: 0 5px !important;
    margin: 0 10px !important;

    &:hover {
      color: var(--theme) !important;
      background: transparent !important;
    }

    &.is-active {
      border-bottom: 2px solid var(--theme) !important;
      color: var(--theme) !important;
    }
  }
}
</style>
