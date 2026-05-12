import request from '@/utils/request'

// 查询电子围栏列表
export function listEnclosure(query) {
  return request({
    url: '/positioning/enclosure/list',
    method: 'get',
    params: query
  })
}

// 查询电子围栏详细
export function getEnclosure(id) {
  return request({
    url: '/positioning/enclosure/' + id,
    method: 'get'
  })
}

export function getAreaTree(id) {
  return request({
    url: '/positioning/enclosure/getAreaTree',
    method: 'get'
  })
}

export function selectZyEnclosureByZyAreaId(id) {
  return request({
    url: '/positioning/enclosure/selectZyEnclosureByZyAreaId',
    method: 'get',
    params: {id: id}
  })
}

export function getAllArea(id) {
  return request({
    url: '/positioning/enclosure/getAllArea',
    method: 'get'
  })
}

export function getInfoByModelId(modelId) {
  return request({
    url: '/positioning/enclosure/getInfoByModelId/' + modelId,
    method: 'get'
  })
}

// 新增电子围栏
export function addEnclosure(data) {
  return request({
    url: '/positioning/enclosure',
    method: 'post',
    data: data
  })
}

export function addEnclosure2(data) {
  return request({
    url: '/positioning/enclosure/add2',
    method: 'post',
    data: data
  })
}
export function selectZyEnclosureAddWebRequestByZyId(data) {
  return request({
    url: '/positioning/enclosure/selectZyEnclosureAddWebRequestByZyId',
    method: 'get',
    params: {id: data}
  })
}
export function firing(data) {
  return request({
    url: '/positioning/enclosure/firing',
    method: 'get',
    params: {id: data}
  })
}
export function stop(data) {
  return request({
    url: '/positioning/enclosure/stop',
    method: 'get',
    params: {id: data}
  })
}
export function tagListByEnclosure(data) {
  return request({
    url: '/positioning/enclosure/tagListByEnclosure',
    method: 'post',
    data: {enclosureId: data}
  })
}

// 修改电子围栏
export function updateEnclosure(data) {
  return request({
    url: '/positioning/enclosure',
    method: 'put',
    data: data
  })
}

export function updateEnclosure2(data) {
  return request({
    url: '/positioning/enclosure/edit2',
    method: 'post',
    data: data
  })
}

// 删除电子围栏
export function delEnclosure(id) {
  return request({
    url: '/positioning/enclosure/' + id,
    method: 'delete'
  })
}


export function overManAlarm(data) {
  return request({
    url: '/positioning/enclosure/overManAlarm',
    method: 'POST',
    data: data
  })
}

export function getOverManAlarm(data) {
  return request({
    url: '/positioning/enclosure/overManAlarm',
    method: 'get',
    params: data
  })
}

export function vacanciesAlarm(data) {
  return request({
    url: '/positioning/enclosure/vacanciesAlarm',
    method: 'POST',
    data: data
  })
}

export function getVacanciesAlarm(data) {
  return request({
    url: '/positioning/enclosure/vacanciesAlarm',
    method: 'get',
    params: data
  })
}

export function staticAlarm(data) {
  return request({
    url: '/positioning/enclosure/staticAlarm',
    method: 'POST',
    data: data
  })
}

export function getStaticAlarmAlarm(data) {
  return request({
    url: '/positioning/enclosure/staticAlarm',
    method: 'get',
    params: data
  })
}


export function visitAlarm(data) {
  return request({
    url: '/positioning/enclosure/visitAlarm',
    method: 'POST',
    data: data
  })
}

export function getVisitAlarm(data) {
  return request({
    url: '/positioning/enclosure/visitAlarm',
    method: 'get',
    params: data
  })
}

export function leaveAlarm(data) {
  return request({
    url: '/positioning/enclosure/leaveAlarm',
    method: 'POST',
    data: data
  })
}

export function getLeaveAlarm(data) {
  return request({
    url: '/positioning/enclosure/leaveAlarm',
    method: 'get',
    params: data
  })
}

export function alarmDelete(data) {
  return request({
    url: '/positioning/enclosure/alarmDelete',
    method: 'get',
    params: data
  })
}
