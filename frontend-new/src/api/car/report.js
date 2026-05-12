import request from '@/utils/request'

export function list(query) {
    return request({
        url: '/car/record/list',
        method: 'get',
        params: query
    })
}

export function getRecordTotalByCar(query) {
    return request({
        url: '/car/record/getRecordTotalByCar',
        method: 'get',
        params: query
    })
}

