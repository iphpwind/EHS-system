import request from '@/utils/request'

// 查询工业区域-传感器关联列表
export function listIndustryAreaSensor(query) {
  return request({
    url: '/industry/industryAreaSensor/list',
    method: 'get',
    params: query
  })
}
//实时列表
export function listRealIndustryAreaSensor(query) {
  return request({
    url: '/industry/industryAreaSensor/realList',
    method: 'get',
    params: query
  })
}//实时列表
export function listRealIndustryAreaSensorAll(query) {
  return request({
    url: '/industry/industryAreaSensor/realListAll',
    method: 'get',
    params: query
  })
}
// 查询设备列表
export function listIndustrySensor(query) {
  return request({
    url: '/industry/industryAreaSensor/listIndustrySensor',
    method: 'get',
    params: query
  })
}

// 查询工业区域-传感器关联详细
export function getIndustryAreaSensor(id) {
  return request({
    url: '/industry/industryAreaSensor/' + id,
    method: 'get'
  })
}

export function selectLudian(sensorId) {
  return request({
    url: '/industry/production/selectLudian',
    method: 'get',
    params: {
      sensorId: sensorId
    }
  })
}

// 新增工业区域-传感器关联
export function addIndustryAreaSensor(data) {
  return request({
    url: '/industry/industryAreaSensor',
    method: 'post',
    data: data
  })
}

// 新增多条电表
export function addIndustryAreaSensors(data) {
  return request({
    url: '/industry/industryAreaSensor/addIndustryAreaSensors',
    method: 'post',
    data: data
  })
}

// 修改工业区域-传感器关联
export function updateIndustryAreaSensor(data) {
  return request({
    url: '/industry/industryAreaSensor',
    method: 'put',
    data: data
  })
}

// 删除工业区域-传感器关联
export function delIndustryAreaSensor(id) {
  return request({
    url: '/industry/industryAreaSensor/' + id,
    method: 'delete'
  })
}
