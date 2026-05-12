import request from '@/utils/request'

// 查询隐患整改措施列表
export function listRectmeasure(query) {
  return request({
    url: '/safework/rectmeasure/list',
    method: 'get',
    params: query
  })
}

// 查询隐患整改措施详细
export function getRectmeasure(id) {
  return request({
    url: '/safework/rectmeasure/' + id,
    method: 'get'
  })
}

// 新增隐患整改措施
export function addRectmeasure(data) {
  return request({
    url: '/safework/rectmeasure',
    method: 'post',
    data: data
  })
}

// 修改隐患整改措施
export function updateRectmeasure(data) {
  return request({
    url: '/safework/rectmeasure',
    method: 'put',
    data: data
  })
}

// 删除隐患整改措施
export function delRectmeasure(id) {
  return request({
    url: '/safework/rectmeasure/' + id,
    method: 'delete'
  })
}
