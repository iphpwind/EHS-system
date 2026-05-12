import store from '@/store'
import defaultSettings from '@/settings'

/**
 * 动态修改标题
 */
export function useDynamicTitle() {
    const siteName = store.state.settings.siteName || defaultSettings.title;
    if (store.state.settings.dynamicTitle && store.state.settings.title) {
        document.title = store.state.settings.title + ' - ' + siteName;
    } else {
        document.title = siteName;
    }
}
