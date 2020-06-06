import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

export function loginDev(data) {
  return request({
    url: '/user/loginDev',
    method: 'post',
    data
  })
}

export function getInfo(params) {
  return request({
    url: '/user/info',
    method: 'get',
    params
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

export function checkLogin(data) {
  return request({
    url: '/user/checkLogin',
    method: 'post',
    data
  })
}
export function aboutUs(params) {
  return request({
    url: '/aboutUs',
    method: 'get',
    params
  })
}
// 地址管理
export const addressApi = {
  // 地址列表
  getAddressList(params) {
    return request({
      url: '/user/address',
      method: 'get',
      params
    })
  },
  // 新增地址
  addAddress(data) {
    return request({
      url: '/user/addAddress',
      method: 'post',
      data
    })
  },
  // 编辑地址
  editAddress(data) {
    return request({
      url: '/user/editAddress',
      method: 'post',
      data
    })
  },
  deleteAddress(data) {
    return request({
      url: '/user/delAddress',
      method: 'post',
      data
    })
  }
}
