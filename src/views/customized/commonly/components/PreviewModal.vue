<template>
  <!-- 预览设计 -->
  <van-popup :value="value" :style="{ width: '80%' }" round closeable @input="val => this.$emit('input', val)">
    <div class="modal">
      <div class="modal-title">预览</div>
      <div v-loading="loading" class="modal-content preview-content">
        <img :src="img" alt="" width="100%">
      </div>
      <div class="footer-button">
        <van-button size="small" style="width: 50%" color="linear-gradient(to right, #ff6034,#ee0a24)" @click="change">完成设计</van-button>
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
    },
    loading: {
      type: Boolean,
      default: false
    },
    img: {
      type: String,
      default: ''
    }
  },
  methods: {
    change() {
      this.$emit('complete')
    }
  }
}
</script>

<style lang="scss">
  .preview-content{
      position: relative;
      min-height: 120px;
    }
</style>
