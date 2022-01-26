import axios from 'axios'
import store from '@/store'
import { Toast } from 'vant'
import i18n from '../plugins/i18n'
const { messages } = i18n
// 创建axios实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  withCredentials: true, // 跨域请求时发送cookies
  timeout: 2000000 // 请求超时
})

// 翻译
function translate(msg) {
  const lang = i18n.locale
  if (Array.isArray(msg)) {
    const [key, params] = msg
    const reg = /{\s{0,1}\w+\s{0,1}}/g
    let value = messages[lang][key] || ''
    value = value.replace(reg, val => {
      const param = val.replace(/[{|}]/g, '')
      return translate(params[param]) || params[param] || ''
    })
    return value || key
  } else if (typeof msg === 'string') {
    return messages[lang][msg] || msg
  } else {
    return msg
  }
}

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
      // console.log('err' + res.message) // for debug
      // 402: 未授权/未登录
      if (res.code === 402) {
        // 清除缓存登录状态
        store.dispatch('user/resetToken')
        return res
      }
      // eslint-disable-next-line no-empty
      // if (res.config.url === '/api/wx/custom/reColor') {
      // } else {
        Toast(translate(res.msg) || translate('请求异常'))
      // }
      return Promise.reject(res)
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
