import request from '@/utils/request'

// 查询电力配电图列表
export function listDiagram(query) {
  return request({
    url: '/energy/diagram/list',
    method: 'get',
    params: query
  })
}

// 查询电力配电图详细
export function getDiagram(id) {
  return request({
    url: '/energy/diagram/' + id,
    method: 'get'
  })
}

// 新增电力配电图
export function addDiagram(data) {
  return request({
    url: '/energy/diagram',
    method: 'post',
    data: data
  })
}

// 修改电力配电图
export function updateDiagram(data) {
  return request({
    url: '/energy/diagram',
    method: 'put',
    data: data
  })
}

// 删除电力配电图
export function delDiagram(id) {
  return request({
    url: '/energy/diagram/' + id,
    method: 'delete'
  })
}

// 新增电力配电图
export function GetJxt(id) {
  return request({
    url: '/energy/diagram/GetJxt/' + id,
    method: 'get',
  })
}
