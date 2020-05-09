import request from '@/utils/request'

/**
 * 获取字体列表
 * @param {*} params
 */
export function getFontList(params) {
  return request({
    url: '/font/getFont',
    method: 'get',
    params
  })
}
/**
 * 获取定制商品详情
 * @param {*} params
 */
export function customDetail(params) {
  return request({
    url: '/custom/customInfo',
    method: 'get',
    params
  })
}
/**
 * 获取文字图片
 * @param {*} params
 */
export function getTextImage(params) {
  return request({
    url: '/custom/getFont',
    method: 'get',
    params
  })
}
