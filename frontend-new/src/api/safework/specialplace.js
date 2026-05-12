import request from '@/utils/request'

// 查询作业地点列表
export function listSpecialplace(query) {
  return request({
    url: '/safework/specialplace/list',
    method: 'get',
    params: query
  })
}

// 查询作业地点详细
export function getSpecialplace(id) {
  return request({
    url: '/safework/specialplace/' + id,
    method: 'get'
  })
}

// 新增作业地点
export function addSpecialplace(data) {
  return request({
    url: '/safework/specialplace',
    method: 'post',
    data: data
  })
}

// 修改作业地点
export function updateSpecialplace(data) {
  return request({
    url: '/safework/specialplace',
    method: 'put',
    data: data
  })
}

// 删除作业地点
export function delSpecialplace(id) {
  return request({
    url: '/safework/specialplace/' + id,
    method: 'delete'
  })
}
