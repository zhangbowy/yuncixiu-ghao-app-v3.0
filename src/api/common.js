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
