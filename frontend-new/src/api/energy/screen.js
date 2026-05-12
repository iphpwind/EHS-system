import request from '@/utils/request'

// 查询能耗趋势
export function getSensorEnergy(query) {
  return request({
    url: '/energy/electricScreen/getSensorEnergy',
    method: 'get',
    params: query
  })
}

// 按昨今日按设备查询能耗分布
export function getSensorEnergyByDay(query) {
  return request({
    url: '/energy/electricScreen/getSensorEnergyByDay',
    method: 'get',
    params: query
  })
}

// 电表设备当日耗电量、设备状态
export function getSensorDailyEnergyList(query) {
  return request({
    url: '/energy/electricScreen/getSensorDailyEnergyList',
    method: 'get',
    params: query
  })
}