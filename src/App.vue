<template>
  <div id="app">
    <router-view />
    <Tabbar v-if="this.$route.meta.showTabbar" />
  </div>
</template>
<script>
import Tabbar from './components/Tabbar'
export default {
  components: {
    Tabbar
  }
}
</script>
