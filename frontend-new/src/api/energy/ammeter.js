import request from '@/utils/request'

// 查询电表列表
export function listAmmeter(query) {
  return request({
    url: '/energy/ammeter/list',
    method: 'get',
    params: query
  })
}
//实时列表
export function listRealAmmeter(query) {
  return request({
    url: '/energy/ammeter/realList',
    method: 'get',
    params: query
  })
}
export function listRealAmmeterByDeptId(query) {
  return request({
    url: '/energy/ammeter/realListByDeptId',
    method: 'get',
    params: query
  })
}
// 查询设备列表
export function listSensor(query) {
  return request({
    url: '/energy/ammeter/listSensor',
    method: 'get',
    params: query
  })
}

// 查询电表详细
export function getAmmeter(id) {
  return request({
    url: '/energy/ammeter/' + id,
    method: 'get'
  })
}

// 新增电表
export function addAmmeter(data) {
  return request({
    url: '/energy/ammeter',
    method: 'post',
    data: data
  })
}

// 新增多条电表
export function addAmmeters(data) {
  return request({
    url: '/energy/ammeter/addAmmeters',
    method: 'post',
    data: data
  })
}

// 修改电表
export function updateAmmeter(data) {
  return request({
    url: '/energy/ammeter',
    method: 'put',
    data: data
  })
}

// 删除电表
export function delAmmeter(id) {
  return request({
    url: '/energy/ammeter/' + id,
    method: 'delete'
  })
}
