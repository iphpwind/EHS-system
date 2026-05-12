import axios from 'axios'

const request = axios.create({
  baseURL: '/api',
  timeout: 15000
})

request.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = 'Bearer ' + token
  return config
})

request.interceptors.response.use(
  res => {
    const data = res.data
    // 业务码 401：服务器返回未授权，清除 token 并跳转
    if (data.code === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('userInfo')
      window.location.replace('/h5/#/login')
      return Promise.reject(new Error(data.msg || data.message || '登录已过期'))
    }
    // 兼容 code 为 200、0、无code 三种情况
    if (data.code !== undefined && data.code !== 200 && data.code !== 0 && String(data.code) !== '') {
      return Promise.reject(new Error(data.msg || data.message || '请求失败'))
    }
    return data
  },
  err => {
    // 401 未授权，跳转到登录页
    if (err.response && err.response.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('userInfo')
      window.location.replace('/h5/#/login')
    }
    return Promise.reject(err)
  }
)

export default request
