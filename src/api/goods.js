import request from '@/utils/request'

// 商品api
export const goodsApi = {
  /**
   * 获取商品分类
   * @param {*category_id name} data
   */
  getGoodsList(data) {
    return request({
      url: '/goods/getGoods',
      method: 'post',
      data
    })
  },
  /**
   * 获取商品详情
   * @param {*id} data
   */
  getGoodsDetail(data) {
    return request({
      url: '/goods/detail',
      method: 'post',
      data
    })
  }
}

// 分类api
export const categoryApi = {
  getCategory(params) {
    return request({
      url: '/goods/getCategory',
      method: 'get',
      params
    })
  }
}
