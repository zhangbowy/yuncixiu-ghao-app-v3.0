<template>
  <div class="cell-item" @click="pathTo">
    <div class="left-box">
      <svg-icon :icon-class="iconName" />
      <span>{{ leftText }}</span>
    </div>
    <div class="right-box">
      <span>{{ rightText }}</span>
      <svg-icon icon-class="right-arrow" />
    </div>
  </div>
</template>

<script>
import SvgIcon from '@/components/SvgIcon'
export default {
  components: {
    SvgIcon
  },
  props: {
    iconName: {
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
    path: {
      type: String,
      default: ''
    }
  },
  methods: {
    pathTo() {
      if (this.path !== '') {
        this.$router.push({ path: this.path })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.cell-item{
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 10px;
  border-bottom: 1px solid #f5f5f5;
  .left-box{
    width: 50%;
    font-size: 20px;
    .svg-icon{
      vertical-align: middle;
    }
    span{
      font-size: 14px;
      display: inline-block;
      vertical-align: middle;
      margin-left: 10px;
    }
  }
  .right-box{
    width: 50%;
    text-align: right;
    font-size: 24px;
  }
}
</style>
