import defaultSettings from '@/settings'
import {useDynamicTitle} from '@/utils/dynamicTitle'
import { getConfig } from '@/api/common'

const {sideTheme, showSettings, topNav, tagsView, fixedHeader, sidebarLogo, dynamicTitle} = defaultSettings

const storageSetting = JSON.parse(localStorage.getItem('layout-setting')) || ''
const state = {
    title: '',
    siteName: '安全生产管理系统',
    siteLogo: '',
    theme: storageSetting.theme || '#09bec5',
    sideTheme: storageSetting.sideTheme || sideTheme,
    showSettings: showSettings,
    topNav: storageSetting.topNav === undefined ? topNav : storageSetting.topNav,
    tagsView: storageSetting.tagsView === undefined ? tagsView : storageSetting.tagsView,
    fixedHeader: storageSetting.fixedHeader === undefined ? fixedHeader : storageSetting.fixedHeader,
    sidebarLogo: storageSetting.sidebarLogo === undefined ? sidebarLogo : storageSetting.sidebarLogo,
    dynamicTitle: storageSetting.dynamicTitle === undefined ? dynamicTitle : storageSetting.dynamicTitle
}
const mutations = {
    CHANGE_SETTING: (state, {key, value}) => {
        if (state.hasOwnProperty(key)) {
            state[key] = value
        }
    },
    SET_SITE_NAME: (state, name) => {
        state.siteName = name
    },
    SET_THEME: (state, color) => {
        state.theme = color
    }
}

const actions = {
    // 修改布局设置
    changeSetting({commit}, data) {
        commit('CHANGE_SETTING', data)
    },
    // 设置网页标题
    setTitle({commit}, title) {
        state.title = title
        useDynamicTitle();
    },
    // 从后端获取系统名称
    fetchSiteName({ commit }) {
        return new Promise((resolve) => {
            getConfig('site_name').then(res => {
                const name = res.data?.value || '安全生产管理系统'
                commit('SET_SITE_NAME', name)
                // 动态设置浏览器标题
                useDynamicTitle()
                resolve(name)
            }).catch(() => {
                commit('SET_SITE_NAME', '安全生产管理系统')
                useDynamicTitle()
                resolve('安全生产管理系统')
            })
        })
    },
    // 从后端获取站点Logo
    fetchSiteLogo({ commit }) {
        return new Promise((resolve) => {
            getConfig('site_logo').then(res => {
                const logo = res.data?.value || ''
                commit('CHANGE_SETTING', { key: 'siteLogo', value: logo })
                resolve(logo)
            }).catch(() => {
                commit('CHANGE_SETTING', { key: 'siteLogo', value: '' })
                resolve('')
            })
        })
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}

