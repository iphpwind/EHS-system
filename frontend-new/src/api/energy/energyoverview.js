import request from '@/utils/request'

export function pageIndex(query) {
    return request({
        url: '/energy/electric/index',
        method:'get',
        params: query
    })
}

export function totalElectricityByDay(query) {
    return request({
        url: '/energy/electric/totalElectricityByDay',
        method:'get',
        params: query
    })
}

export function rank(query) {
    return request({
        url: '/energy/electric/rank',
        params: query
    })
}

export function alert(query) {
    return request({
        url: '/energy/electric/alert',
        method:'get',
        params: query
    })
}

export function onLine(query) {
    return request({
        url: '/energy/electric/onLine',
        method: 'get',
        params: query
    })
}
export function deptAndElectricAreaTreeSelect() {
    return request({
        url: '/energy/electric/deptAndElectricAreaTreeSelect',
        method: 'get'
    })
}