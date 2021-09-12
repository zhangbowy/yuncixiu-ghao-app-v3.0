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
   * @param {*id} data
   */
  getPreview(data) {
    return request({
      url: '/custom/getPreview',
      method: 'post',
      data
    })
  },
  /**
   * 获取定制模板
   * @param {*id} params
   */
  getEmbTemplate(params) {
    return request({
      url: '/custom/getEmbTemplate',
      method: 'get',
      params
    })
  },
  /**
   * 去除背景
   * @param {*formData} params
   */
  removeBackground(data) {
    return request({
      url: '/custom/removeBg',
      method: 'post',
      data
    })
  },
  /**
   * 上传图片
   */
  uploadImg(data) {
    return request({
      url: '/custom/uploadImg',
      method: 'post',
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      data
    })
  },
  getDesignById(params) {
    return request({
      url: '/custom/getDesignById',
      method: 'get',
      params
    })
  }
}
