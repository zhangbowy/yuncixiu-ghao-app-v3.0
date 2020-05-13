import request from '@/utils/request'

export const designApi = {
  /**
 * 获取字体列表
 * @param {*} params
 */
  getFontList(params) {
    return request({
      url: '/font/getFont',
      method: 'get',
      params
    })
  },
  /**
 * 获取定制商品详情
 * @param {*} params
 */
  customDetail(params) {
    return request({
      url: '/custom/customInfo',
      method: 'get',
      params
    })
  },
  /**
 * 获取文字图片
 * @param {*} params
 */
  getTextImage(params) {
    return request({
      url: '/custom/getFont',
      method: 'get',
      params
    })
  },

  /**
 * 图片换色
 * @param {*} data
 */
  reColor(data) {
    return request({
      url: '/custom/reColor',
      method: 'post',
      data
    })
  },
  /**
 * 获取花样
 * @param {*currentPage limit} params
 */
  getFigure(params) {
    return request({
      url: '/custom/getDesign',
      method: 'get',
      params
    })
  },
  /**
   * 获取预览图
   * @param {*id} params
   */
  getPreview(params) {
    return request({
      url: '/custom/getPreview',
      method: 'get',
      params
    })
  }
}
