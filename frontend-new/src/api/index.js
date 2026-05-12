import request from '@/utils/request'

/**
 * 获取首页设备统计
 * @returns {Promise<import('axios').AxiosResponse>}
 */
export function equimentCount() {
    return request({
        url: '/system/sysIndex/equimentCount',
        method: 'get'
    })
}

/**
 * 获取首页设备类型分布
 * @returns {Promise<import('axios').AxiosResponse>}
 */
export function equimentType() {
    return request({
        url: '/system/sysIndex/equimentType',
        method: 'get'
    })
}

/**
 * 获取告警趋势
 * @param {Object} params
 * @returns {Promise<import('axios').AxiosResponse>}
 */
export function alarmTrend(params) {
    return request({
        url: '/system/sysIndex/alarmTrend',
        method: 'get',
        params: params
    })
}

// 统一导出所有 API 模块（barrel export）
export { default as request } from '@/utils/request'
export * from './login'
export * from './menu'
export * from './common'
export * from './video'
export * from './hxhb'
