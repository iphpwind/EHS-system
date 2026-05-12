import request from '@/utils/request'

// 查询设备分类列表
export function listClassification(query) {
    return request({
        url: '/equipment/classification/list',
        method: 'get',
        params: query
    })
}

// 查询设备分类详细
export function getClassification(id) {
    return request({
        url: '/equipment/classification/' + id,
        method: 'get'
    })
}

// 新增设备分类
export function addClassification(data) {
    return request({
        url: '/equipment/classification',
        method: 'post',
        data: data
    })
}

// 修改设备分类
export function updateClassification(data) {
    return request({
        url: '/equipment/classification',
        method: 'put',
        data: data
    })
}

// 删除设备分类
export function delClassification(id) {
    return request({
        url: '/equipment/classification/' + id,
        method: 'delete'
    })
}
