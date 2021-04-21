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
import { mapGetters } from 'vuex'
export default {
  components: {
    Tabbar
  },
  computed: {
    ...mapGetters(['lang'])
  },
  created() {
    document.documentElement.dataset.lang = this.lang
  }
}
</script>
