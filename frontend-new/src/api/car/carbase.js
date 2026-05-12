import request from '@/utils/request'

export function currentLocation() {
    return request({
        url: '/car/base/currentLocation',
        method: 'get',
    })
}

export function currentLocationByCar(carId) {
    return request({
        url: '/car/base/currentLocationByCar',
        method: 'get',
        params: {
            carId: carId
        }
    })
}


export function historicalTrack(checkCarId, starttime, endtime) {
    return request({
        url: '/car/base/historicalTrack',
        method: 'get',
        params: {
            carId: checkCarId,
            startTime: starttime,
            endTime: endtime
        }
    })
}

export function GPSToBD(params) {
    return request({
        url: '/car/base/GPSToBD',
        method: 'post',
        data: params
    })
}
