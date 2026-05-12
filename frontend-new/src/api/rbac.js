import request from '@/utils/request'

// ========== 角色管理 ==========
export function listRole(query) {
  return request({ url: '/rbac/roles', method: 'get', params: query })
}

export function listRoleOptions() {
  return request({ url: '/rbac/roles/options', method: 'get' })
}

export function addRole(data) {
  return request({ url: '/rbac/roles', method: 'post', data })
}

export function updateRole(id, data) {
  return request({ url: '/rbac/roles/' + id, method: 'put', data })
}

export function delRole(id) {
  return request({ url: '/rbac/roles/' + id, method: 'delete' })
}

// ========== 菜单管理 ==========
export function listMenu() {
  return request({ url: '/rbac/menus', method: 'get' })
}

export function listMenuTree() {
  return request({ url: '/rbac/menus/tree', method: 'get' })
}

export function addMenu(data) {
  return request({ url: '/rbac/menus', method: 'post', data })
}

export function updateMenu(id, data) {
  return request({ url: '/rbac/menus/' + id, method: 'put', data })
}

export function delMenu(id) {
  return request({ url: '/rbac/menus/' + id, method: 'delete' })
}

// ========== 用户角色 ==========
export function getUserRoles(userId) {
  return request({ url: '/rbac/users/' + userId + '/roles', method: 'get' })
}

export function assignUserRoles(userId, data) {
  return request({ url: '/rbac/users/' + userId + '/roles', method: 'post', data })
}

// ========== 角色菜单 ==========
export function getRoleMenus(roleId) {
  return request({ url: '/rbac/roles/' + roleId + '/menus', method: 'get' })
}

export function assignRoleMenus(roleId, data) {
  return request({ url: '/rbac/roles/' + roleId + '/menus', method: 'post', data })
}

// ========== 当前用户权限（核心） ==========
export function getCurrentPermissions() {
  return request({ url: '/rbac/permissions/me', method: 'get' })
}
