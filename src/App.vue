<template>
  <div id="app">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive" />
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive" />
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
