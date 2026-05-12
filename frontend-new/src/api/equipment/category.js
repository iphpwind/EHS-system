import request from '@/utils/request'

// 查询设备类别列表
export function listCategory(query) {
    return request({
        url: '/equipment/category/list',
        method: 'get',
        params: query
    })
}

// 查询设备类别详细
export function getCategory(id) {
    return request({
        url: '/equipment/category/' + id,
        method: 'get'
    })
}

// 新增设备类别
export function addCategory(data) {
    return request({
        url: '/equipment/category',
        method: 'post',
        data: data
    })
}

// 修改设备类别
export function updateCategory(data) {
    return request({
        url: '/equipment/category',
        method: 'put',
        data: data
    })
}

// 删除设备类别
export function delCategory(id) {
    return request({
        url: '/equipment/category/' + id,
        method: 'delete'
    })
}
