import { useSettingsStore } from '@/store/modules/settings'
import defaultSettings from '@/settings'

/**
 * 动态修改标题
 */
export function useDynamicTitle() {
    const settingsStore = useSettingsStore()
    const siteName = settingsStore.siteName || defaultSettings.title;
    if (settingsStore.dynamicTitle && settingsStore.title) {
        document.title = settingsStore.title + ' - ' + siteName;
    } else {
        document.title = siteName;
    }
}
