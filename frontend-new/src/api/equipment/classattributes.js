import request from '@/utils/request'

// 查询分类属性列表
export function listAttributes(query) {
    return request({
        url: '/equipment/classAttributes/list',
        method: 'get',
        params: query
    })
}

// 查询分类属性详细
export function getAttributes(id) {
    return request({
        url: '/equipment/classAttributes/' + id,
        method: 'get'
    })
}

// 新增分类属性
export function addAttributes(data) {
    return request({
        url: '/equipment/classAttributes',
        method: 'post',
        data: data
    })
}

// 修改分类属性
export function updateAttributes(data) {
    return request({
        url: '/equipment/classAttributes',
        method: 'put',
        data: data
    })
}

// 删除分类属性
export function delAttributes(id) {
    return request({
        url: '/equipment/classAttributes/' + id,
        method: 'delete'
    })
}
