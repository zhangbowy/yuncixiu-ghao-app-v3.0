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
  },
  // 订单支付
  orderPay(data) {
    return request({
      url: '/order/pay',
      method: 'post',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      data
    })
  },
  // 订单列表
  getOrderList(data) {
    return request({
      url: '/order/list',
      method: 'post',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      data
    })
  },
  // 订单详情
  orderDetail(params) {
    return request({
      url: '/order/detail',
      method: 'get',
      params
    })
  },
  // 取消订单
  orderCancel(data) {
    return request({
      url: '/order/cancel',
      method: 'post',
      data
    })
  }
}
