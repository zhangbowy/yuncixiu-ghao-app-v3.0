<template>
  <div class="designArea">
    <div class="bg-box">
      <!-- 背景图 -->
      <!-- <img class="bg-img" :src="background" :style="areaInfo.designImgStyle" alt=""> -->
      <!-- 设计区域 -->
      <div class="design-box" :style="areaInfo.designBoxStyle">
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

  }
}
</script>

<style lang="scss" scoped>
// 设计区域
.designArea{
  height: 100vh;
  position: absolute;
  top: 0;
  width: 100%;
  left: 0;
  .bg-box{
    width: 100%;
    height: 100vh;
    overflow: hidden;
    position: absolute;
  }
  .design-box{
    position: absolute;
    overflow: hidden;
    background: rgba(0, 0, 0, 0.5);
  }
}
</style>
