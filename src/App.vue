<template>
  <div id="app">
    <router-view />
    <Tabbar v-if="this.$route.meta.showTabbar" :path="this.$route.path" />
  </div>
</template>
<script>
import Tabbar from './components/Tabbar'
// import { isWeiXin } from '@/utils'
export default {
  components: {
    Tabbar
  },
  created() {
    // checkLogin().then(res => {
    //   if (res.code === 0) {
    //     this.$store.commit('SET_LOGIN_STATUS', true)
    //   }else{}
    // })
  }
}
</script>
