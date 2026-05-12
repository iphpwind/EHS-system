import request from '@/utils/request'

// 查询应急预案列表
export function listDrill(query) {
  return request({
    url: '/safework/drill/list',
    method: 'get',
    params: query
  })
}

// 查询应急预案详细
export function getDrill(id) {
  return request({
    url: '/safework/drill/' + id,
    method: 'get'
  })
}

// 新增应急预案
export function addDrill(data) {
  return request({
    url: '/safework/drill',
    method: 'post',
    data: data
  })
}

// 修改应急预案
export function updateDrill(data) {
  return request({
    url: '/safework/drill',
    method: 'put',
    data: data
  })
}

// 删除应急预案
export function delDrill(id) {
  return request({
    url: '/safework/drill/' + id,
    method: 'delete'
  })
}
