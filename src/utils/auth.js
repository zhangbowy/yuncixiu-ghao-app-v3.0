// import Cookies from 'js-cookie'

const isLogin = 'is_login'

export function getStatus() {
  return localStorage.getItem(isLogin)
}

export function setStatus(status) {
  return localStorage.setItem(isLogin, status)
}

export function removeStatus() {
  return localStorage.removeItem(isLogin)
}
