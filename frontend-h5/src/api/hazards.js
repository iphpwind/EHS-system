import request from './request'

/** 获取隐患列表（分页+筛选） */
export function getHazardList(params) {
  return request.get('/hazards', { params })
}

/** 获取隐患详情 */
export function getHazardDetail(id) {
  return request.get('/hazards/' + id)
}

/** 新增隐患 */
export function createHazard(data) {
  return request.post('/hazards', data)
}

/** 更新隐患 */
export function updateHazard(id, data) {
  return request.put('/hazards/' + id, data)
}

/** 删除隐患 */
export function deleteHazard(id) {
  return request.delete('/hazards/' + id)
}

/** 整改隐患 */
export function rectifyHazard(id, data) {
  return request.post('/hazards/' + id + '/rectify', data)
}

/** 验收隐患 */
export function acceptHazard(id, data) {
  return request.post('/hazards/' + id + '/accept', data)
}

/** 获取隐患统计 */
export function getHazardStats(params) {
  return request.get('/hazards/stats', { params })
}
