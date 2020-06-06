<template>
  <div class="about-us">
    <top-bar title="关于我们" class />
    <div class="about-content" v-html="content" />
  </div>
</template>

<script>
import TopBar from '@/components/TopBar'
import { aboutUs } from '@/api/user'
export default {
  components: {
    TopBar
  },
  data() {
    return {
      content: ''
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      aboutUs().then(res => {
        this.content = res.data.about_us
      })
    }
  }
}
</script>

<style>
.about-content{
  padding: 10px;
}
</style>
<style lang="scss">
// 修改富文本样式
.about-us{
  .about-content{
    font-size: 12pt;
    p{
      margin: 5px 0;
    }
    img{
      max-width: 100%;
    }
  }
}
</style>

