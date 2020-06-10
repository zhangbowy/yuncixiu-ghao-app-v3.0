<template>
  <div class="designArea">
    <div v-show="full">
      <van-popup :value="true" :style="{ width: '100%',height: '100vh' }">
        <div class="confirm-modal">
          <div class="full-page-design">
            <slot name="design-content" />
          </div>
          <div class="confirm-footer">
            <van-button size="small" color="#333" plain type="primary" @click="hidden">完成</van-button>
          </div>
        </div>
      </van-popup>
    </div>
    <div v-show="!full" class="bg-box">
      <!-- 背景图 -->
      <img class="bg-img" :src="background" :style="areaInfo.designImgStyle" alt="">
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
  .design-box{
    position: absolute;
    overflow: hidden;
    background: rgba(0, 0, 0, 0.5);
    border: 5px solid rgba(192, 192, 192, 0.5);
  }
  .full-page-design{
    background: rgba(0, 0, 0, 0.5);
  }
}
</style>
