import request from '@/utils/request'

// 查询定位卡信息列表
export function listCard(query) {
  return request({
    url: '/positioning/card/list',
    method: 'get',
    params: query
  })
}

export function filterListCard(query) {
  return request({
    url: '/positioning/card/filterList',
    method: 'get',
    params: query
  })
}

// 查询定位卡信息详细
export function getCard(id) {
  return request({
    url: '/positioning/card/' + id,
    method: 'get'
  })
}

export function getCardByTagId(tagId) {
  return request({
    url: '/positioning/card/cardByTagId?tagId=' + tagId,
    method: 'get'
  })
}

// 新增定位卡信息
export function addCard(data) {
  return request({
    url: '/positioning/card',
    method: 'post',
    data: data
  })
}

// 修改定位卡信息
export function updateCard(data) {
  return request({
    url: '/positioning/card',
    method: 'put',
    data: data
  })
}

// 删除定位卡信息
export function delCard(id) {
  return request({
    url: '/positioning/card/' + id,
    method: 'delete'
  })
}

export function bindStaff(data) {
  return request({
    url: '/positioning/card/bindStaff',
    method: 'post',
    data: data
  })
}

export function unbindStaffList(data) {
  return request({
    url: '/positioning/card/unbindStaffList',
    method: 'post',
    data: data
  })
}


export function unbindStaff(data) {
  return request({
    url: '/positioning/card/unbindStaff',
    method: 'post',
    data: data
  })
}

export function findStaffByTag(query) {
  return request({
    url: '/positioning/card/findStaffByTag',
    method: 'get',
    params: query
  })
}

export function currentCardList() {
  return request({
    url: '/positioning/card/currentCardList',
    method: 'get'
  })
}
