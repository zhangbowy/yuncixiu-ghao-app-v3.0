<template>
  <div class="customized">
    <div class="navbar">
      <!-- tab标题栏 -->
      <top-bar title="开始设计" />
    </div>
    <div class="customized-content">
      <router-view />
    </div>
  </div>
</template>

<script>
import TopBar from '@/components/TopBar'
export default {
  components: {
    TopBar
  }
}
</script>
<style lang="scss">
.customized{
  .navbar{
    position: fixed;
    top: 0;
    width: 100%;
    left: 0;
    z-index: 9999;
  }
  .customized-content{
    height: 100vh;
    box-sizing: border-box;
  }
}
</style>
