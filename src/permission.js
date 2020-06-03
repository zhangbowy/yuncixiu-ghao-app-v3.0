import router from './router'
import store from './store'
import NProgress from 'nprogress' // 进度条
import 'nprogress/nprogress.css' // 进度条样式
import getPageTitle from '@/utils/get-page-title'
import { isWeiXin } from '@/utils'

import { getStatus } from '@/utils/auth' // 从cookie中获取token

// const whiteList = ['/login']

NProgress.configure({
  showSpinner: false
}) // NProgress配置

router.beforeEach(async(to, from, next) => {
  // 开始进度条
  NProgress.start()
  // 设置页面标题
  document.title = getPageTitle(to.meta.title)
  // 确定用户是否已登录
  const isLogin = getStatus()
  if (isLogin) {
    const hasGetUserInfo = store.getters.name
    if (hasGetUserInfo) {
      next()
    } else {
      try {
        // 获取用户信息
        await store.dispatch('user/getInfo').catch((err) => {
          console.log(err)
          store.dispatch('user/resetToken')
          // Message.error(err || '验证失败，请重新登陆')
          // next({ path: '/' })
        })
        next()
      } catch (error) {
        // 获取用户信息失败
        console.log('error', error)
        NProgress.done()
      }
    }
  } else {
    await store.dispatch('user/checkLogin').then((res) => {
      if (!res) {
        if (isWeiXin()) {
          // 生产环境
          store.dispatch('user/login')
        } else {
          // 开发环境
          store.dispatch('user/loginDev').then(res => {
            next(`${to.path}`)
          })
        }
      } else {
        next()
      }
    })
    // if (whiteList.indexOf(to.path) !== -1) {
    //   // in the free login whitelist, go directly
    //   next()
    // } else {
    //   // other pages that do not have permission to access are redirected to the login page.
    //   next(`/login?redirect=${to.path}`)
    //   NProgress.done()
    // }
    NProgress.done()
  }
  NProgress.done()
})

router.afterEach(() => {
  // 进度条结束
  NProgress.done()
})
