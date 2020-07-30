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
  // 订单创建
  orderCreate(data) {
    return request({
      url: '/order/create',
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
  },
  // 订单确认收货
  confirmReceived(data) {
    return request({
      url: '/order/confirmReceived',
      method: 'post',
      data
    })
  },
  // 订单物流
  orderTrace(data) {
    return request({
      url: '/order/orderTrace',
      method: 'post',
      data
    })
  },

  /**
   * 回复报价
   * @param {*order_no buyer_message price} data
   */
  askOrder(data) {
    return request({
      url: '/order/askOrder',
      method: 'post',
      data
    })
  },
  /**
   * 保存机器码
   * @param {*order_no machine_code} data
   */
  scanMachine(data) {
    return request({
      url: '/order/scanMachine',
      method: 'post',
      data
    })
  },
  /**
   * 删除订单
   * @param {*order_no machine_code} data
   */
  deleteOrder(data) {
    return request({
      url: '/order/delOrder',
      method: 'post',
      data
    })
  }
}
