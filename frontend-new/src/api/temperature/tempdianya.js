import request from '@/utils/request'

// 查询手环电压列表
export function listTempdianya(query) {
  return request({
    url: '/temperature/tempdianya/list',
    method: 'get',
    params: query
  })
}

// 查询手环电压详细
export function getTempdianya(tId) {
  return request({
    url: '/temperature/tempdianya/' + tId,
    method: 'get'
  })
}

// 新增手环电压
export function addTempdianya(data) {
  return request({
    url: '/temperature/tempdianya',
    method: 'post',
    data: data
  })
}

// 修改手环电压
export function updateTempdianya(data) {
  return request({
    url: '/temperature/tempdianya',
    method: 'put',
    data: data
  })
}

// 删除手环电压
export function delTempdianya(tId) {
  return request({
    url: '/temperature/tempdianya/' + tId,
    method: 'delete'
  })
}
