import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'
const LsTokenKey = 'token'

const ExpiresInKey = 'Admin-Expires-In'
const LsExpiresInKey = 'expires_in'

/**
 * 获取登录令牌（优先 localStorage，回退 Cookie）
 * @returns {string | undefined}
 */
export function getToken() {
    return localStorage.getItem(LsTokenKey) || Cookies.get(TokenKey) || undefined
}

/**
 * 设置登录令牌（双模式存储）
 * @param {string} token
 */
export function setToken(token) {
    localStorage.setItem(LsTokenKey, token)
    Cookies.set(TokenKey, token)
}

/**
 * 移除登录令牌
 */
export function removeToken() {
    localStorage.removeItem(LsTokenKey)
    Cookies.remove(TokenKey)
}

/**
 * 获取令牌过期时间
 * @returns {string | number}
 */
export function getExpiresIn() {
    return localStorage.getItem(LsExpiresInKey) || Cookies.get(ExpiresInKey) || -1
}

/**
 * 设置令牌过期时间
 * @param {string | number} time
 */
export function setExpiresIn(time) {
    localStorage.setItem(LsExpiresInKey, String(time))
    Cookies.set(ExpiresInKey, time)
}

/**
 * 移除令牌过期时间
 */
export function removeExpiresIn() {
    localStorage.removeItem(LsExpiresInKey)
    Cookies.remove(ExpiresInKey)
}
