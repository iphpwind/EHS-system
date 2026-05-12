import request from '@/utils/request'

// 登录方法
export function login(username, password) {
    return request({
        url: '/auth/login',
        headers: {
            isToken: false
        },
        method: 'post',
        data: {username, password}
    })
}

// 单独设备运行监控大屏登录方法
export function display(username, password) {
    return request({
        url: '/auth/display',
        headers: {
            isToken: false
        },
        method: 'post',
        data: {username, password}
    })
}

// 获取key
export function getPublicKey() {
    return request({
        url: '/auth/publicKey',
        method: 'get',
    })
}
// 注册方法
export function register(data) {
    return request({
        url: '/auth/register',
        headers: {
            isToken: false
        },
        method: 'post',
        data: data
    })
}

// 刷新方法
export function refreshToken() {
    return request({
        url: '/auth/refresh',
        method: 'post'
    })
}

// 获取用户详细信息
export function getInfo() {
    return request({
        url: '/system/user/getInfo',
        method: 'get'
    })
}

// 退出方法
export function logout() {
    return request({
        url: '/auth/logout',
        method: 'delete'
    })
}

// 获取验证码
export function getCodeImg() {
    return request({
        url: '/code',
        headers: {
            isToken: false
        },
        method: 'get',
        timeout: 20000
    })
}
