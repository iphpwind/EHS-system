import request from '@/utils/request'

export function cgCmd(data) {
  return request({
    url: '/industry/industrySensorData/cgCmd',
    method: 'post',
    data: data
  })
}


// 查询工业数据详细
export function getIndustrySensorData(id) {
  return request({
    url: '/industry/industrySensorData/' + id,
    method: 'get'
  })
}

// 查询工业数据详细
export function getYcHis(data) {
  return request({
    url: '/industry/industrySensorData/getYcHis',
    method: 'post',
    data: data
  })
}

// 查询工业数据详细
export function getYxHis(data) {
  return request({
    url: '/industry/industrySensorData/getYxHis',
    method: 'post',
    data: data
  })
}

export function historyIncrement(data) {
  return request({
    url: '/industry/industrySensorData/historyIncrement',
    method: 'post',
    data: data
  })
}

export function todayIncrement(data) {
  return request({
    url: '/industry/industrySensorData/todayIncrement',
    method: 'post',
    data: data
  })
}
export function historyIncrementByAreaAndYcNoAndDate(data) {
  return request({
    url: '/industry/industrySensorData/historyIncrementByAreaAndYcNoAndDate',
    method: 'post',
    data: data
  })
}
