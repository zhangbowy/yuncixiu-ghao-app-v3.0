import request from '@/utils/request'

// 花样api
export const figureApi = {
  // 花样类别
  getCategory(params) {
    return request({
      url: '/design/getCategory',
      method: 'get',
      params
    })
  }
}

