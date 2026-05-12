import request from '@/utils/request'

// 查询点检字典列表
export function listSpotCheckDict(query) {
  return request({
    url: '/equipment/spotCheckDict/list',
    method: 'get',
    params: query
  })
}

// 查询点检字典详细
export function getSpotCheckDict(dictId) {
  return request({
    url: '/equipment/spotCheckDict/' + dictId,
    method: 'get'
  })
}

// 新增点检字典
export function addSpotCheckDict(data) {
  return request({
    url: '/equipment/spotCheckDict',
    method: 'post',
    data: data
  })
}

// 修改点检字典
export function updateSpotCheckDict(data) {
  return request({
    url: '/equipment/spotCheckDict',
    method: 'put',
    data: data
  })
}

// 删除点检字典
export function delSpotCheckDict(dictId) {
  return request({
    url: '/equipment/spotCheckDict/' + dictId,
    method: 'delete'
  })
}

export function changeOrderNum(data){
  return request({
    url: '/equipment/spotCheckDict/changeOrderNum',
    method: 'post',
    data: data
  })
}