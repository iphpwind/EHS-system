import request from '@/utils/request'

// 查询电表冻结电量详细
export function getTimePower(data) {
  return request({
    url: '/energy/timePower/getTimePower',
    method: 'get',
		params: data
  })
}

// 查询区域电表冻结电量详细
export function getTimePowerByArea(data) {
  return request({
    url: '/energy/timePower/getTimePowerByArea',
    method: 'get',
		params: data
  })
}

// 查询区域电表冻结电量排行
export function getTimePowerRankByArea(data) {
  return request({
    url: '/energy/timePower/getTimePowerRankByArea',
    method: 'get',
		params: data
  })
}
