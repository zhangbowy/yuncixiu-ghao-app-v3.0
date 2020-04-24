<template>
  <div class="no-data" :style="`font-size:${fontSize}px`">
    <svg-icon :icon-class="icon" />
    <p style="font-size:14px; color: #999999">{{ text }}</p>
  </div>
</template>

<script>
import SvgIcon from '@/components/SvgIcon'
export default {
  components: {
    SvgIcon
  },
  props: {
    icon: {
      type: String,
      default: ''
    },
    fontSize: {
      type: Number,
      default: 48
    },
    text: {
      type: String,
      default: '暂无数据'
    }
  }
}
</script>

<style lang="scss" scoped>
.no-data{
  text-align: center;
}
</style>
