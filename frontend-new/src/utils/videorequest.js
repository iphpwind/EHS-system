import axios from 'axios'


// axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'
// create an axios instance
// let url = localStorage.getItem("videourl")
let url = ""
const service = axios.create({
	//baseURL: "/api1/", // url = base url + request url
	// baseURL: 'https://fbms.jutocean.com/',
	// withCredentials: true, // send cookies when cross-domain requests
	// baseURL:url,
	timeout: 100000 // request timeout
})
// request interceptor
service.interceptors.request.use(
	config => {
		// // do something before request is sent
		// if (uni.getStorageSync('token')) {
		// 	// let each request carry token
		// 	// ['X-Token'] is a custom headers key
		// 	// please modify it according to the actual situation
		// 	config.headers['Authorization'] = 'Bearer '+uni.getStorageSync('token')
		// }
		return config
	},
	error => {
		// do something with request error
		console.log(error) // for debug
		return Promise.reject(error)
	}
)


export default service
