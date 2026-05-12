import request from '@/utils/request'

// 查询聚集参数配置列表
export function listGatherConfig(query) {
  return request({
    url: '/positioning/gatherConfig/list',
    method: 'get',
    params: query
  })
}

// 查询聚集参数配置详细
export function getGatherconfig(id) {
  return request({
    url: '/positioning/gatherConfig/' + id,
    method: 'get'
  })
}

// 新增聚集参数配置
export function addGatherconfig(data) {
  return request({
    url: '/positioning/gatherConfig',
    method: 'post',
    data: data
  })
}

// 修改聚集参数配置
export function updateGatherconfig(data) {
  return request({
    url: '/positioning/gatherConfig',
    method: 'put',
    data: data
  })
}

// 删除聚集参数配置
export function delGatherconfig(id) {
  return request({
    url: '/positioning/gatherConfig/' + id,
    method: 'delete'
  })
}
