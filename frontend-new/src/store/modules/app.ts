import { defineStore } from 'pinia'
import { ref } from 'vue'
import Cookies from 'js-cookie'

export const useAppStore = defineStore('app', () => {
  const sidebar = ref({
    opened: Cookies.get('sidebarStatus') ? !!+Cookies.get('sidebarStatus') : true,
    withoutAnimation: false,
    hide: false
  })
  const device = ref('desktop')
  const hide = ref(true)
  const size = ref(Cookies.get('size') || 'default')

  const toggleSideBar = () => {
    if (sidebar.value.hide) {
      return false
    }
    sidebar.value.opened = !sidebar.value.opened
    sidebar.value.withoutAnimation = false
    if (sidebar.value.opened) {
      Cookies.set('sidebarStatus', '1')
    } else {
      Cookies.set('sidebarStatus', '0')
    }
    return true
  }

  const closeSideBar = (withoutAnimation: boolean) => {
    Cookies.set('sidebarStatus', '0')
    sidebar.value.opened = false
    sidebar.value.withoutAnimation = withoutAnimation
  }

  const toggleDevice = (deviceType: string) => {
    device.value = deviceType
  }

  const setSize = (sizeValue: string) => {
    size.value = sizeValue
    Cookies.set('size', sizeValue)
  }

  const setSidebarHide = (status: boolean) => {
    sidebar.value.hide = status
  }

  const topHide = (hideValue: boolean) => {
    hide.value = hideValue
  }

  return {
    sidebar,
    device,
    hide,
    size,
    toggleSideBar,
    closeSideBar,
    toggleDevice,
    setSize,
    setSidebarHide,
    topHide
  }
}, {
  persist: {
    key: 'ehs-app',
    paths: ['sidebar.opened', 'size']
  }
})
