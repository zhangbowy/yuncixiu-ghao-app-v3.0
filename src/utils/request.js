import axios from 'axios'
import store from '@/store'
import { isWeiXin } from '@/utils'
import router from '@/router'

// 创建axios实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  withCredentials: true, // 跨域请求时发送cookies
  timeout: 20000 // 请求超时
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 在发出请求前做点什么
    if (store.getters.token) {
    // 让每个请求携带令牌
    // ['X-Token']是自定义头密钥
    // 请根据实际情况修改
      // config.headers['X-Token'] = getToken()
    }
    return config
  },
  error => {
    // 处理请求错误
    console.log(error) // for debug
    return Promise.reject(error)
  }
)
// 响应拦截器
service.interceptors.response.use(
  /**
    *如果您想要获取诸如头或状态之类的http信息
    *请返回response=>response
  */
  /**
    *通过自定义代码确定请求状态
    *这里只是一个例子
    *您还可以通过HTTP状态代码判断状态
  */
  response => {
    const res = response.data
    // 如果自定义代码不是0，则判断为错误。
    if (res.code !== 0) {
      console.log('err' + res.message) // for debug
      // 402: 未授权
      if (res.code === 402) {
        if (isWeiXin()) {
          // 生产环境
          store.dispatch('user/login').then(res => {
            router.push({ path: '/' })
          })
        } else {
          // 开发环境
          store.dispatch('user/loginDev').then(res => {
            router.push({ path: '/' })
          })
        }
      }
      return Promise.reject(new Error('Error'))
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    return Promise.reject(error)
  }
)

export default service
