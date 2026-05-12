import request from '@/utils/request'

// 查询统计时长信息列表
export function listWorkTime(query) {
  return request({
    url: '/industry/worktime/list',
    method: 'get',
    params: query
  })
}