import {login, logout, getInfo, refreshToken} from '@/api/login'
import {getToken, setToken, setExpiresIn, removeToken} from '@/utils/auth'
import defAva from '@/assets/images/profile.jpg'

const user = {
    state: {
        token: getToken(),
        name: '',
        avatar: '',
        roles: [],
        permissions: [],
        user: {}
    },

    mutations: {
        SET_TOKEN: (state, token) => {
            state.token = token
        },
        SET_EXPIRES_IN: (state, time) => {
            state.expires_in = time
        },
        SET_NAME: (state, name) => {
            state.name = name
        },
        SET_AVATAR: (state, avatar) => {
            state.avatar = avatar
        },
        SET_ROLES: (state, roles) => {
            state.roles = roles
        },
        SET_USER: (state, user) => {
            state.user = user
        },
        SET_PERMISSIONS: (state, permissions) => {
            state.permissions = permissions
        }
    },

    actions: {
        // 登录
        Login({commit}, userInfo) {
            const username = userInfo.username.trim()
            const password = userInfo.password
            return new Promise((resolve, reject) => {
                login(username, password).then(res => {
                    let data = res.data
                    setToken(data.access_token)
                    commit('SET_TOKEN', data.access_token)
                    setExpiresIn(data.expires_in)
                    commit('SET_EXPIRES_IN', data.expires_in)
                    resolve()
                }).catch(error => {
                    reject(error)
                })
            })
        },

        // 获取用户信息
        GetInfo({commit, state}) {
            return new Promise((resolve, reject) => {
                getInfo().then(res => {
                    const user = res.user
                    const avatar = (user.avatar == "" || user.avatar == null) ? defAva : user.avatar;

                    if (res.roles && res.roles.length > 0) { // 验证返回的roles是否是一个非空数组
                        commit('SET_ROLES', res.roles)
                        commit('SET_PERMISSIONS', res.permissions)
                    } else {
                        commit('SET_ROLES', ['ROLE_DEFAULT'])
                    }
                    commit('SET_NAME', user.userName)
                    commit('SET_AVATAR', avatar)
                    commit('SET_USER', user)
                    resolve(res)
                }).catch(error => {
                    reject(error)
                })
            })
        },

        // 刷新token
        RefreshToken({commit, state}) {
            return new Promise((resolve, reject) => {
                refreshToken().then(res => {
                    const data = res.data || res
                    const newToken = data.access_token || data.token || state.token
                    setToken(newToken)
                    commit('SET_TOKEN', newToken)
                    const expiresIn = data.expires_in || data.expiresIn || 7200
                    setExpiresIn(expiresIn)
                    commit('SET_EXPIRES_IN', expiresIn)
                    resolve(newToken)
                }).catch(error => {
                    reject(error)
                })
            })
        },

        // 退出系统
        LogOut({commit, state}) {
            return new Promise((resolve, reject) => {
                logout(state.token).then(() => {
                    commit('SET_TOKEN', '')
                    commit('SET_ROLES', [])
                    commit('SET_PERMISSIONS', [])
                    commit('SET_USER', {})
                    removeToken()
                    resolve()
                }).catch(error => {
                    reject(error)
                })
            })
        },

        // 前端 登出
        FedLogOut({commit}) {
            return new Promise(resolve => {
                commit('SET_TOKEN', '')
                removeToken()
                resolve()
            })
        }
    }
}

export default user
