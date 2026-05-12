import request from '@/utils/request'

// 查询通讯协议列表
export function listProtocol(query) {
    return request({
        url: '/sensor/protocol/list',
        method: 'get',
        params: query
    })
}

// 查询通讯协议详细
export function getProtocol(protocolId) {
    return request({
        url: '/sensor/protocol/' + protocolId,
        method: 'get'
    })
}

// 新增通讯协议
export function addProtocol(data) {
    return request({
        url: '/sensor/protocol',
        method: 'post',
        data: data
    })
}

// 修改通讯协议
export function updateProtocol(data) {
    return request({
        url: '/sensor/protocol',
        method: 'put',
        data: data
    })
}

// 删除通讯协议
export function delProtocol(protocolId) {
    return request({
        url: '/sensor/protocol/' + protocolId,
        method: 'delete'
    })
}
