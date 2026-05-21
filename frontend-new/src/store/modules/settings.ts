import { defineStore } from 'pinia'
import { ref } from 'vue'
import defaultSettings from '@/settings'
import { useDynamicTitle } from '@/utils/dynamicTitle'
import { getConfig } from '@/api/common'

const { sideTheme, showSettings, topNav, tagsView, fixedHeader, sidebarLogo, dynamicTitle } = defaultSettings

const storageSetting = JSON.parse(localStorage.getItem('layout-setting') || '{}')

export const useSettingsStore = defineStore('settings', () => {
  const title = ref('')
  const siteName = ref('安全生产管理系统')
  const siteLogo = ref('')
  const theme = ref(storageSetting.theme || '#09bec5')
  const sideTheme = ref(storageSetting.sideTheme || sideTheme)
  const showSettings = ref(showSettings)
  const topNav = ref(storageSetting.topNav === undefined ? topNav : storageSetting.topNav)
  const tagsView = ref(storageSetting.tagsView === undefined ? tagsView : storageSetting.tagsView)
  const fixedHeader = ref(storageSetting.fixedHeader === undefined ? fixedHeader : storageSetting.fixedHeader)
  const sidebarLogo = ref(storageSetting.sidebarLogo === undefined ? sidebarLogo : storageSetting.sidebarLogo)
  const dynamicTitle = ref(storageSetting.dynamicTitle === undefined ? dynamicTitle : storageSetting.dynamicTitle)

  const changeSetting = (data: { key: string; value: any }) => {
    if (Object.prototype.hasOwnProperty.call(data, 'key') && Object.prototype.hasOwnProperty.call(data, 'value')) {
      const key = data.key as keyof ReturnType<typeof useSettingsStore>
      if (key in { title, siteName, siteLogo, theme, sideTheme, showSettings, topNav, tagsView, fixedHeader, sidebarLogo, dynamicTitle }) {
        ;(title as Record<string, any>)[key] = data.value
      }
    }
  }

  const setTitle = (newTitle: string) => {
    title.value = newTitle
    useDynamicTitle()
  }

  const fetchSiteName = async () => {
    try {
      const res = await getConfig('site_name')
      const name = res.data?.value || '安全生产管理系统'
      siteName.value = name
      useDynamicTitle()
      return name
    } catch {
      siteName.value = '安全生产管理系统'
      useDynamicTitle()
      return '安全生产管理系统'
    }
  }

  const fetchSiteLogo = async () => {
    try {
      const res = await getConfig('site_logo')
      const logo = res.data?.value || ''
      siteLogo.value = logo
      return logo
    } catch {
      siteLogo.value = ''
      return ''
    }
  }

  const SET_THEME = (color: string) => {
    theme.value = color
  }

  return {
    title,
    siteName,
    siteLogo,
    theme,
    sideTheme,
    showSettings,
    topNav,
    tagsView,
    fixedHeader,
    sidebarLogo,
    dynamicTitle,
    changeSetting,
    setTitle,
    fetchSiteName,
    fetchSiteLogo,
    SET_THEME
  }
}, {
  persist: {
    key: 'ehs-settings',
    paths: ['theme', 'sideTheme', 'topNav', 'tagsView', 'fixedHeader', 'sidebarLogo', 'dynamicTitle']
  }
})
