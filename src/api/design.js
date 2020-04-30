import request from '@/utils/request'

export function getFontList(params) {
  return request({
    url: '/font/getFont',
    method: 'get',
    params
  })
}
