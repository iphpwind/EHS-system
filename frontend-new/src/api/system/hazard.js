import request from '@/utils/request'

export function addHazardSource(p, id, t) {
    let json = {
        position: JSON.stringify(p),
        id: id,
        type: t
    }
    return request({
        url: '/positioning/hazardSource/add',
        method: 'post',
        data: json
    })
}

export function loadHazardSource(type, typeId) {
    let urlStr = '/positioning/hazardSource/load'
    if (typeof type !== 'undefined') {
        urlStr += '?type=' + type
        if (typeof typeId !== 'undefined') {
            urlStr += '&typeId=' + typeId
        }
    }
    return request({
        url: urlStr,
        method: 'get'
    })
}

export function addLayer(p, label, id, t, area) {
    let json = {
        position: JSON.stringify(p),
        id: id,
        type: t,
        label: label,
        areaId: area
    }
    return request({
        url: '/positioning/hazardSource/addLayer',
        method: 'post',
        data: json
    })
}

export function removeById(id) {
    return request({
        url: '/positioning/hazardSource/removeById?id=' + id,
        method: 'GET',
    })
}

export function selectSensorData(pointId) {
    return request({
        url: '/positioning/hazardSource/selectSensorData?id=' + pointId,
        method: 'GET',
    })
}


export function getMeasuringInfo(no, type, searchType) {
    return request({
        url: '/positioning/hazardSource/getMeasuringInfo',
        method: 'get',
        params: {
            no: no,
            type: type,
            searchType: searchType
        }
    })
}


export function getModelInfo(id) {
    return request({
        url: '/positioning/hazardSource/getModelInfo',
        method: 'get',
        params: {
            id: id,
        }
    })
}

export function getModelInfoList(ids) {
    return request({
        url: '/positioning/hazardSource/getModelInfoList',
        method: 'post',
        data: ids
    })
}


export function getCameraByPoint(id) {
    return request({
        url: '/positioning/hazardSource/getCameraByPoint',
        method: 'get',
        params: {
            pointId: id,
        }
    })
}
