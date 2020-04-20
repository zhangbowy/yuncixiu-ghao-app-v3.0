<template>
  <div>
    <van-nav-bar
      :title="title"
      :left-text="leftText"
      :right-text="rightText"
      left-arrow
      @click-left="onClickLeft"
    />
  </div>
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
      default: '返回'
    },
    rightText: {
      type: String,
      default: ''
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
