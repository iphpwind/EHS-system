import request from '@/utils/request'

// 获取系统配置项（公开接口，无需认证）
export function getConfig(key) {
  return request({
    url: `/config/${key}`,
    method: 'get',
    headers: { isToken: false }
  })
}

// 获取所有系统配置（公开接口）
export function getAllConfig() {
  return request({
    url: '/config',
    method: 'get',
    headers: { isToken: false }
  })
}
