<template>
  <div />
</template>

<script>
import { GetUrlParam, isWeiXin } from '@/utils'
import store from '@/store'
export default {
  name: 'Login',
  data() {
    return {
      APPID: process.env.VUE_APP_WX_APPID
    }
  },
  created() {
    // this.getCode()
  },
  methods: {
    getCode() { // 非静默授权，第一次有弹框
      const code = GetUrlParam() // 截取路径中的code，如果没有就去微信授权，如果已经获取到了就直接传code给后台获取openId
      const local = window.location.href
      if (code.code == null || code.code === '') {
        window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + this.APPID + '&redirect_uri=' + encodeURIComponent(local) + '&response_type=code&scope=snsapi_userinfo&state=1#wechat_redirect'
      } else {
        this.getOpenId(code.code) // 把code传给后台获取用户信息
      }
    },
    getOpenId(code) { // 通过code获取 token等用户信息
      if (isWeiXin()) {
        // 生产环境
        store.dispatch('user/login', code)
      } else {
        // 开发环境
        store.dispatch('user/loginDev').then(res => {
        })
      }
      // login({ code: code }).then((res) => {
      //   const datas = res.data
      //   if (datas.code === 0) {
      //     console.log(`${this.$t('成功')}`)
      //   }
      // }).catch((error) => {
      //   console.log(error)
      // })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
