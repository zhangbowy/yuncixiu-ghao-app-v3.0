import request from '@/utils/request'

export const indexApi = {
  getIndex(params) {
    return request({
      url: '/index',
      method: 'get',
      params
    })
  }
}
