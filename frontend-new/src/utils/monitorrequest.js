import axios from 'axios'



axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded'
// 创建axios实例
const service = axios.create({
    // axios中请求配置有baseURL选项，表示请求URL公共部分
    baseURL:'http://safework.cgiot.net',
    // 超时
    timeout: 100000
})



export default service
