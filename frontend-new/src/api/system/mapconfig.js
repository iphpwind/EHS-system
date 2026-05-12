import request from '@/utils/request'

export function selectSensorList() {
    return request({
        url: '/positioning/config/selectSensorList',
        method: 'GET'
    })
}

export function selectListBySensor(sensorId) {
    let json = {
        sensorId: sensorId,
    }
    return request({
        url: '/positioning/config/selectListBySensor',
        method: 'GET',
        params: json
    })
}

export function bind(pointId, sensorId, ids, type) {
    let json = {
        sensorId: sensorId,
        ids: ids,
        pointId: pointId,
        type: type
    }
    return request({
        url: '/positioning/config/bindSensor',
        method: 'POST',
        data: json
    })
}

export function getPointBind(pointId) {
    let json = {
        pointId: pointId,
    }
    return request({
        url: '/positioning/config/getBindSensor',
        method: 'GET',
        params: json
    })
}

export function mapConfig(data) {
    return request({
        url: '/positioning/config/mapConfig',
        method: 'POST',
        data: data
    })
}


export function cameraByUser() {
    return request({
        url: '/positioning/camera/listByUser',
        method: 'GET',
    })
}

export function cameraBind(pointId, cameraId) {
    return request({
        url: '/positioning/camera/bind',
        method: 'GET',
        params: {
            pointId: pointId,
            cameraId: cameraId
        }
    })
}

export function cameraByPoint(pointId) {
    return request({
        url: '/positioning/camera/selectByPoint',
        method: 'POST',
        data: {
            pointId: pointId
        }
    })
}

export function findAllZyDevice(data) {
    return request({
        url: '/positioning/basic/findAllZyDevice',
        method: 'GET',
        params: data
    })
}
