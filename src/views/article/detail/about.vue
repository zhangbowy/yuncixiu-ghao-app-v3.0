<template>
  <div>
    <top-bar title="关于我们" />
    <div class="about-content" v-html="content" />
  </div>
</template>

<script>
import TopBar from '@/components/TopBar'
export default {
  components: {
    TopBar
  },
  data() {
    return {
      content: ''
    }
  }
}
</script>

<style>
.about-content{
  padding: 10px;
}
</style>
