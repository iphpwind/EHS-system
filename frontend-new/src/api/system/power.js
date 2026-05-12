import request from '@/utils/request'

export function dataCategoryList() {
    return request({
        url: '/energy/category/selectList',
        method: 'get'
    })
}

export function electricAreaId(param) {
    return request({
        url: '/energy/electric/areaSensorList',
        method: 'get',
        params: param
    })
}

export function totalAreaEnergy(sensorId, category, date) {
    let json = {
        sensorId: sensorId,
        category: category,
        date: date
    }
    return request({
        url: '/energy/electric/totalAreaEnergy',
        method: 'post',
        data: json
    })
}
