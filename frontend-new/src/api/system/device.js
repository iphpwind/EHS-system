import request from '@/utils/request'

export function history(data) {
  return request({
    url: '/positioning/device/getHistoryByTag',
    method: 'post',
    data: data
  })
}


export function beaconList() {
  return request({
    url: '/positioning/device/getBeaconLocation',
    method: 'get',
  })
}


export function baseStationList() {
  return request({
    url: '/positioning/device/getBaseStationLocation',
    method: 'get',
  })
}

export function baseStationListPage(data) {
  return request({
    url: '/positioning/device/getBaseStationLocation',
    method: 'post',
    data: data
  })
}

export function beaconListPage(data) {
  return request({
    url: '/positioning/device/getBeaconLocation',
    method: 'post',
    data: data
  })
}
