import request from '@/utils/request'

// 查询传感器管理列表
export function listSensor(query) {
  return request({
    url: '/sensor/sensor/list',
    method: 'get',
    params: query
  })
}

// 查询传感器管理详细
export function getSensor(equipmentId) {
  return request({
    url: '/sensor/sensor/' + equipmentId,
    method: 'get'
  })
}

// 新增传感器管理
export function addSensor(data) {
  return request({
    url: '/sensor/sensor',
    method: 'post',
    data: data
  })
}

// 修改传感器管理
export function updateSensor(data) {
  return request({
    url: '/sensor/sensor',
    method: 'put',
    data: data
  })
}

// 删除传感器管理
export function delSensor(equipmentId) {
  return request({
    url: '/sensor/sensor/' + equipmentId,
    method: 'delete'
  })
}
// 修改传感器管理
export function updateDataForRedis(data){
  return request({
    url: '/sensor/sensor/updateDataForRedis',
    method: 'post',
    data: data
  })
}

export function updateBatchDataForRedis(data){
  return request({
    url: '/sensor/sensor/updateBatchDataForRedis',
    method: 'post',
    data: data
  })
}
//停用传感器
export function updateSensorSatus(data){
  return request({
    url: '/sensor/sensor/updateSensorSatus',
    method: 'post',
    data: data
  })
}
// 获取设备列表
export function getEquipmentList() {
  return request({
    url: '/sensor/sensor/getEquipmentList',
    method: 'get'
  })
}
// 查询地区设备数量统计
export function getSensorCountByArea(query) {
  return request({
    url: '/sensor/sensor/getSensorCountByArea',
    method: 'get',
    params: query
  })
}
// 索尔/核信大屏客户数量
export function getDeptCounts() {
  return request({
    url: '/sensor/sensor/getDeptCounts',
    method: 'get',
  })
}

// 尚美丽家大屏客户数量
export function getSMDeptCounts() {
  return request({
    url: '/sensor/sensor/getSMDeptCounts',
    method: 'get',
  })
}

// 索尔/核信大屏设备数量
export function getEquipCountsByDeptId() {
  return request({
    url: '/sensor/sensor/getEquipCountsByDeptId',
    method: 'get',
  })
}
// 索尔/核信大屏告警分类统计
export function getAlertCountsByTypeForLast15Days(interval) {
  return request({
    url: '/sensor/sensorYcYuex/getAlertCountsByTypeForLast15Days/'+interval,
    method: 'get'
  })
}
// 修改传感器管理
export function reloadAllPoint(data) {
  return request({
    url: '/sensor/sensor/reloadAllPoint',
    method: 'post',
    data: data
  })
}

export function batchReloadAllPoint(data) {
  return request({
    url: '/sensor/sensor/batchReloadAllPoint',
    method: 'post',
    data: data
  })
}

// 获取实时数据
export function getCurrentData(ycNo) {
  return request({
    url: '/sensor/sensor/currentDataByYcNo',
    method: 'get',
    params:ycNo
  })
}
// 尚美丽家大屏告警分类统计
export function getAlertDataByTypeForLast15Days(interval) {
  return request({
    url: '/sensor/sensorYcYuex/getAlertDataByTypeForLast15Days/'+interval,
    method: 'get'
  })
}

export function sensoryxhis(type) {
  return request({
    url: '/sensor/sensorYxHis/getyxByType/'+type,
    method:'get',
  })
}
export function sensoryxhisByDate(start, end) {
  return request({
    url: '/sensor/sensorYxHis/getyxByType',
    method:'get',
    params: {
      startDate: start,
      endDate: end
    }
  })
}

export function getyxhisList() {
  return request({
    url: '/sensor/sensorYxHis/getyxhisList',
    method:'get',
  })
}
export function getyxhisList2(deptId) {
  return request({
    url: '/sensor/sensorYxHis/getyxhisList',
    method:'get',
    params: {deptId: deptId}
  })
}


export function last7DayCountYx() {
  return request({
    url: '/sensor/sensorYxHis/last7DayCountYx',
    method:'get',
  })
}

export function sortByCompany(start, end) {
  return request({
    url: '/sensor/sensorYxHis/sortByCompany',
    method:'get',
    params: {
      startDate: start,
      endDate: end
    }
  })
}

export function getAllCompanyYxhisList() {
  return request({
    url: '/sensor/sensorYxHis/getAllCompanyYxhisList',
    method:'get',
  })
}
export function getYxhisListByDept(deptId) {
  return request({
    url: '/sensor/sensorYxHis/getYxhisListByDept',
    method:'get',
    params: {
      deptId: deptId
    }
  })
}

export function getYxhisSensorRankByDept(deptId) {
  return request({
    url: '/sensor/sensorYxHis/getYxhisSensorRankByDept',
    method:'get',
    params: {
      deptId: deptId
    }
  })
}

export function getyxByCompany(deptId) {
  return request({
    url: '/sensor/sensorYxHis/getyxByCompany',
    method:'get',
    params: {
      deptId: deptId
    }
  })
}
export function countYxByCompany(deptId) {
  return request({
    url: '/sensor/sensorYxHis/countYxByCompany',
    method:'get',
    params: {
      deptId: deptId
    }
  })
}
