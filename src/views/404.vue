<template>
  <div class="wscn-http404-container">
    <div class="wscn-http404">
      <div class="bullshit">
        <div class="bullshit__headline">{{ message }}</div>
        <a href="/" class="bullshit__return-home">返回首页</a>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Page404',
  computed: {
    message() {
      return '页面不存在...'
    }
  }
}
</script>

<style lang="scss" scoped>
.wscn-http404-container{
  padding: 50px 0;
  font-size: 18px;
  text-align: center;
}
.bullshit__headline{
  margin-bottom: 50px;
}
.bullshit__return-home{
  color: #02b7ff;
}
</style>
