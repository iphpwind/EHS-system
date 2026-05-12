import request from '@/utils/request'

// 获取所有模块配置
export function listModules() {
  return request({
    url: '/module-config',
    method: 'get'
  })
}

// 更新模块状态
export function updateModuleStatus(moduleKey, enabled) {
  return request({
    url: '/module-config/' + moduleKey,
    method: 'put',
    data: { enabled }
  })
}

// 批量更新模块
export function batchUpdateModules(modules) {
  return request({
    url: '/module-config',
    method: 'put',
    data: { modules }
  })
}
