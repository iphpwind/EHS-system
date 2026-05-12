import request from '@/utils/request'

// 查询车辆位置信息列表
export function onLine(query) {
  return request({
    url: '/environment/base/onLine',
    method: 'get',
    params: query
  })
}
export function deptAndEnvironmentAreaTreeSelect() {
  return request({
      url: '/environment/base/deptAndEnvironmentAreaTreeSelect',
      method: 'get'
  })
}