import monitorrequest from '@/utils/monitorrequest'

// 查询萤石云AccessToken
export function getAccessToken(data) {
    return monitorrequest({
        url: '/ys-api/api/lapp/token/get',
        method: 'post',
        params: data
    })
}
// 查询萤石云播放列表
export function getUrl(data) {
    return monitorrequest({
        url: '/ys-api/api/lapp/v2/live/address/get',
        method: 'post',
        params: data
    })
}
// 往萤石云上添加设备
export function addmonitor(data) {
    return monitorrequest({
        url: '/ys-api/api/lapp/device/add',
        method: 'post',
        params: data
    })
}
// 修改萤石云上设备
export function upMonitor(data) {
    return monitorrequest({
        url: '/ys-api/api/lapp/device/name/update',
        method: 'post',
        params: data
    })
}
// 删除萤石云上设备
export function delmonitor(data) {
    return monitorrequest({
        url: '/ys-api/api/lapp/device/delete',
        method: 'post',
        params: data
    })
}
