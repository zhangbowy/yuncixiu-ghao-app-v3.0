<template>
  <van-popup :value="value" :style="{ width: '100%',height: '100vh' }" @input="val => this.$emit('input', val)">
    <div class="confirm-modal">
      <div class="full-page-design">
        <slot name="fullpageDesign" />
      </div>
      <div class="confirm-footer">
        <van-button size="small" color="#333" plain type="primary" @click="hidden">{{ $t(`完成`) }}</van-button>
      </div>
    </div>
  </van-popup>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    hidden() {
      this.$emit('hidden')
    }
  }
}
</script>

<style lang="scss">
.confirm-modal{
    height: 100vh;
    position: relative;
    .confirm-content{
      padding: 12px;
      text-align: center;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      width: 100%;
      box-sizing: border-box;
    }
    .confirm-footer{
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      background: #f5f5f5;
      display: flex;
      align-items: center;
      padding: 0 30px;
      height: 7vh;
      box-sizing: border-box;
      justify-content: space-between;
      button{
        width: 30%;
      }
    }
  }
</style>
