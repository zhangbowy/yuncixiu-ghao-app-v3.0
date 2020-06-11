<template>
  <div class="designArea">
    <div class="bg-box">
      <!-- 背景图 -->
      <img class="bg-img" :src="background" :style="areaInfo.designImgStyle" alt="">
      <!-- 设计区域 -->
      <div class="design-box">
        <slot name="design-content" />
      </div>
      <!-- 设计区域结束 -->
    </div>
  </div>
</template>

<script>
export default {
  props: {
    areaInfo: {
      type: Object,
      default: () => {}
    },
    background: {
      type: String,
      default: ''
    },
    full: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      area_info: {
      }
    }
  },
  watch: {
    areaInfo: {
      deep: true,
      handler(newValue, oldValue) {
        this.area_info = newValue
      }
    }
  },
  created() {
  },
  methods: {
    hidden() {
      this.$emit('hidden')
    }
  }
}
</script>

<style lang="scss" scoped>
// 设计区域
.designArea{
  height: 60vh;
  width: 100%;
  .bg-box{
    width: 100%;
    height: 375px;
    overflow: hidden;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>
