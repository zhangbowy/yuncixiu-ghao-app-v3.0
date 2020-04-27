import request from '@/utils/request'

export const orderApi = {
  // 计算订单价格
  calculation(data) {
    return request({
      url: '/order/calculation',
      method: 'post',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      data
    })
  }
}
