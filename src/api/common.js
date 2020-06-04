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
