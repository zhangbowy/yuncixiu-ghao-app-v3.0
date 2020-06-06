<template>
  <van-nav-bar
    style="color:#333"
    :title="title"
    :left-text="leftText"
    :right-text="rightText"
    left-arrow
    :border="border"
    @click-left="onClickLeft"
  />
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    leftText: {
      type: String,
      default: ''
    },
    rightText: {
      type: String,
      default: ''
    },
    border: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1) // 返回上一层
    }
  }
}
</script>

<style>

</style>
