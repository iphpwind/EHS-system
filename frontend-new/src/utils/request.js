import axios from 'axios'
import {ElNotification, ElMessageBox, ElMessage, ElLoading} from 'element-plus'
import store from '@/store'
import {getToken} from '@/utils/auth'
import errorCode from '@/utils/errorCode'
import {tansParams, blobValidate} from '@/utils/ruoyi'
import cache from '@/plugins/cache'
import {saveAs} from 'file-saver'

let downloadLoadingInstance;
// 是否显示重新登录
export let isRelogin = {show: false};

// 请求取消映射（用于取消重复请求）
const pendingMap = new Map()

/**
 * 生成请求唯一标识
 * @param {import('axios').AxiosRequestConfig} config
 * @returns {string}
 */
function getPendingKey(config) {
    return `${config.method}&${config.url}&${JSON.stringify(config.params)}&${JSON.stringify(config.data)}`
}

/**
 * 添加请求到 pending 队列
 * @param {import('axios').AxiosRequestConfig} config
 */
function addPending(config) {
    const key = getPendingKey(config)
    if (!pendingMap.has(key)) {
        const controller = new AbortController()
        config.signal = controller.signal
        pendingMap.set(key, controller)
    }
}

/**
 * 移除 pending 请求
 * @param {import('axios').AxiosRequestConfig} config
 */
function removePending(config) {
    const key = getPendingKey(config)
    if (pendingMap.has(key)) {
        pendingMap.delete(key)
    }
}

/**
 * 取消所有 pending 请求
 */
export function cancelAllPending() {
    pendingMap.forEach(controller => controller.abort())
    pendingMap.clear()
}

axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'
// 创建axios实例
const service = axios.create({
    // axios中请求配置有baseURL选项，表示请求URL公共部分
    baseURL: import.meta.env.VITE_APP_BASE_API,
    // 超时
    timeout: 15000
})

// request拦截器
service.interceptors.request.use(config => {
    // 是否需要设置 token
    const isToken = (config.headers || {}).isToken === false
    // 是否需要防止数据重复提交
    const isRepeatSubmit = (config.headers || {}).repeatSubmit === false
    if (getToken() && !isToken) {
        config.headers['Authorization'] = 'Bearer ' + getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    // get请求映射params参数
    if (config.method === 'get' && config.params) {
        let url = config.url + '?' + tansParams(config.params);
        url = url.slice(0, -1);
        config.params = {};
        config.url = url;
    }
    // 请求去重：同一请求未返回前取消上一次（可选，通过 headers.cancelRepeat 控制）
    if (config.headers.cancelRepeat !== false) {
        addPending(config)
    }
    if (!isRepeatSubmit && (config.method === 'post' || config.method === 'put')) {
        const requestObj = {
            url: config.url,
            data: typeof config.data === 'object' ? JSON.stringify(config.data) : config.data,
            time: new Date().getTime()
        }
        const sessionObj = cache.session.getJSON('sessionObj')
        if (sessionObj === undefined || sessionObj === null || sessionObj === '') {
            cache.session.setJSON('sessionObj', requestObj)
        } else {
            const s_url = sessionObj.url;                // 请求地址
            const s_data = sessionObj.data;              // 请求数据
            const s_time = sessionObj.time;              // 请求时间
            const interval = 1000;                       // 间隔时间(ms)，小于此时间视为重复提交
            if (s_data === requestObj.data && requestObj.time - s_time < interval && s_url === requestObj.url) {
                const message = '数据正在处理，请勿重复提交';
                console.warn(`[${s_url}]: ` + message)
                return Promise.reject(new Error(message))
            } else {
                cache.session.setJSON('sessionObj', requestObj)
            }
        }
    }
    // 开发环境打印请求日志
    if (import.meta.env.DEV) {
        console.log(`[Request] ${config.method?.toUpperCase()} ${config.url}`, config.params || config.data || '')
    }
    return config
}, error => {
    console.log(error)
    Promise.reject(error)
})

// 是否正在刷新token
let isRefreshing = false
// 等待刷新token的请求队列
let refreshSubscribers = []

/**
 * 通知所有等待的请求继续
 * @param {string} token
 */
function onTokenRefreshed(token) {
    refreshSubscribers.forEach(cb => cb(token))
    refreshSubscribers = []
}

/**
 * 添加请求到刷新队列
 * @param {(token: string) => void} cb
 */
function addRefreshSubscriber(cb) {
    refreshSubscribers.push(cb)
}

// 响应拦截器
service.interceptors.response.use(res => {
        // 移除 pending
        removePending(res.config)
        // 未设置状态码则默认成功状态
        const code = res.data.code || 200;
        // 获取错误信息
        const msg = errorCode[code] || res.data.msg || errorCode['default']
        // 二进制数据则直接返回
        if (res.request.responseType === 'blob' || res.request.responseType === 'arraybuffer') {
            return res.data
        }
        // 检查是否是token相关错误（支持数值401和字符串code）
        const isTokenError = code === 401 || 
                            code === 'TOKEN_EXPIRED' || 
                            code === 'NO_TOKEN' || 
                            code === 'INVALID_TOKEN';
        if (isTokenError) {
            if (!isRelogin.show) {
                isRelogin.show = true;
                ElMessageBox.confirm('登录状态已过期，您可以继续留在该页面，或者重新登录', '系统提示', {
                        confirmButtonText: '重新登录',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }
                ).then(() => {
                    isRelogin.show = false;
                    store.dispatch('LogOut').then(() => {
                        location.href = '/login';
                    })
                }).catch(() => {
                    isRelogin.show = false;
                });
            }
            return Promise.reject('无效的会话，或者会话已过期，请重新登录。')
        } else if (code === 500) {
            ElMessage({
                message: msg,
                type: 'error'
            })
            return Promise.reject(new Error(msg))
        } else if (code !== 200) {
            ElNotification.error({
                title: msg
            })
            return Promise.reject('error')
        } else {
            return Promise.resolve(res.data)
        }
    },
    error => {
        // 移除 pending
        if (error.config) removePending(error.config)
        // 主动取消的请求不弹窗
        if (axios.isCancel(error) || error.name === 'CanceledError' || error.message === 'canceled') {
            return Promise.reject(error)
        }
        const {response, config} = error
        // 401 自动刷新 token（仅当响应状态码为 401 且非刷新/登录/登出接口时）
        if (response && response.status === 401) {
            const noRefreshUrls = ['/auth/login', '/auth/refresh', '/auth/logout', '/code']
            const shouldRefresh = !noRefreshUrls.some(url => config.url.includes(url))
            if (shouldRefresh) {
                if (!isRefreshing) {
                    isRefreshing = true
                    return store.dispatch('RefreshToken').then((newToken) => {
                        isRefreshing = false
                        onTokenRefreshed(newToken)
                        // 重试原始请求
                        config.headers['Authorization'] = 'Bearer ' + newToken
                        return service(config)
                    }).catch(() => {
                        isRefreshing = false
                        refreshSubscribers = []
                        store.dispatch('LogOut').then(() => {
                            location.href = '/login'
                        })
                        return Promise.reject(error)
                    })
                } else {
                    // 正在刷新中，将请求加入队列等待
                    return new Promise(resolve => {
                        addRefreshSubscriber(token => {
                            config.headers['Authorization'] = 'Bearer ' + token
                            resolve(service(config))
                        })
                    })
                }
            }
        }
        console.log('err' + error)
        let {message} = error;
        if (message == "Network Error") {
            message = "后端接口连接异常";
        } else if (message.includes("timeout")) {
            message = "系统接口请求超时";
        } else if (message.includes("Request failed with status code")) {
            message = "系统接口" + message.substr(message.length - 3) + "异常";
        }
        ElMessage({
            message: message,
            type: 'error',
            duration: 5 * 1000
        })
        return Promise.reject(error)
    }
)

// 通用下载方法
export function download(url, params, filename) {
    downloadLoadingInstance = ElLoading.service({text: "正在下载数据，请稍候", background: "rgba(0, 0, 0, 0.7)",})
    return service.post(url, params, {
        transformRequest: [(params) => {
            return tansParams(params)
        }],
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        responseType: 'blob'
    }).then(async (data) => {
        const isLogin = await blobValidate(data);
        if (isLogin) {
            const blob = new Blob([data])
            saveAs(blob, filename)
        } else {
            const resText = await data.text();
            const rspObj = JSON.parse(resText);
            const errMsg = errorCode[rspObj.code] || rspObj.msg || errorCode['default']
            ElMessage.error(errMsg);
        }
        downloadLoadingInstance.close();
    }).catch((r) => {
        console.error(r)
        ElMessage.error('下载文件出现错误，请联系管理员！')
        downloadLoadingInstance.close();
    })
}

export default service
