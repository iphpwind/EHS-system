import request from '@/utils/request'

// 查询地区码列表
export function listArea(query) {
    return request({
        url: '/system/area/list',
        method: 'get',
        params: query
    })
}

// 查询地区码详细
export function getArea(areaid) {
    return request({
        url: '/system/area/' + areaid,
        method: 'get'
    })
}

// 新增地区码
export function addArea(data) {
    return request({
        url: '/system/area',
        method: 'post',
        data: data
    })
}

// 修改地区码
export function updateArea(data) {
    return request({
        url: '/system/area',
        method: 'put',
        data: data
    })
}

// 删除地区码
export function delArea(areaid) {
    return request({
        url: '/system/area/' + areaid,
        method: 'delete'
    })
}
