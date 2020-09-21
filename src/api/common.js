import request from '@/utils/request'

export const wxSdkApi = {
  getJsConfig(data) {
    return request({
      url: '/user/getJsConfig',
      method: 'post',
      data
    })
  }
}
// 代理图片
export const commonApi = {
  getImage(params) {
    return request({
      url: '/custom/getImage',
      method: 'get',
      params
    })
  }
}

// 获取语言包
export function getLanguage(params) {
  return request({
    url: '/getLang',
    method: 'get',
    params
  })
}
