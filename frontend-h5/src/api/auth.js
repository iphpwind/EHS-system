import request from './request'

/**
 * 用户登录
 * @param {Object} data - { username, password, code, uuid }
 */
export function login(data) {
  return request.post('/auth/login', data)
}

/**
 * 获取用户信息
 */
export function getUserInfo() {
  return request.get('/system/user/getInfo')
}

/**
 * 获取验证码
 */
export function getCaptcha() {
  return request.get('/code')
}

/**
 * 用户登出（清除本地 token 即可，后端无需额外操作）
 */
export function logout() {
  localStorage.removeItem('token')
  localStorage.removeItem('userInfo')
  return Promise.resolve({ success: true })
}

export default {
  login,
  getUserInfo,
  getCaptcha,
  logout
}
