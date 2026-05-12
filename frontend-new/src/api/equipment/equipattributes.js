import request from '@/utils/request'

// 查询设备分类属性列表
export function listEquipAttributes(query) {
    return request({
        url: '/equipment/equipAttributes/list',
        method: 'get',
        params: query
    })
}

// 查询设备分类属性详细
export function getAttributes(id) {
    return request({
        url: '/equipment/equipAttributes/' + id,
        method: 'get'
    })
}

// 新增设备分类属性
export function addAttributes(data) {
    return request({
        url: '/equipment/equipAttributes',
        method: 'post',
        data: data
    })
}

// 修改设备分类属性
export function updateAttributes(data) {
    return request({
        url: '/equipment/equipAttributes',
        method: 'put',
        data: data
    })
}

// 删除设备分类属性
export function delAttributes(id) {
    return request({
        url: '/equipment/equipAttributes/' + id,
        method: 'delete'
    })
}
