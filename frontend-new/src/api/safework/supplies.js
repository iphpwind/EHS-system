import request from '@/utils/request'

// 查询应急物资列表
export function listSupplies(query) {
  return request({
    url: '/safework/supplies/list',
    method: 'get',
    params: query
  })
}

// 查询应急物资详细
export function getSupplies(id) {
  return request({
    url: '/safework/supplies/' + id,
    method: 'get'
  })
}

// 新增应急物资
export function addSupplies(data) {
  return request({
    url: '/safework/supplies',
    method: 'post',
    data: data
  })
}

// 修改应急物资
export function updateSupplies(data) {
  return request({
    url: '/safework/supplies',
    method: 'put',
    data: data
  })
}

// 删除应急物资
export function delSupplies(id) {
  return request({
    url: '/safework/supplies/' + id,
    method: 'delete'
  })
}

export function importTemplate(id) {
  return request({
    url: '/safework/supplies/importTemplate',
    method: 'post'
  })
}
